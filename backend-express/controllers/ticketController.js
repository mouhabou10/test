import Ticket from '../models/ticket.model.js';
import ServiceProvider from '../models/serviceProvider.model.js';
import Client from '../models/client.model.js';
import User from '../models/user.model.js';
import Worker from '../models/worker.model.js';

// Track recent ticket creations to prevent duplicates
const recentTicketCreations = new Map();

// Track request IDs to prevent duplicate submissions
const processedRequestIds = new Set();

// Create a ticket for a client
export const createTicket = async (req, res) => {
  // Ticket creation request received
  
  // Extract client and service provider IDs
  const clientId = req.body.client;
  const serviceProviderId = req.body.serviceProvider;
  const ticketType = req.body.ticketType || 'consultation';
  const clientName = req.body.clientName;
  
  // Check for request ID (used to prevent duplicate submissions)
  const requestId = req.body.requestId || req.headers['x-request-id'];
  if (requestId && processedRequestIds.has(requestId)) {
    // Request ID already processed - preventing duplicate
    
    // Try to find the ticket that was created with this request
    try {
      const existingTicket = await Ticket.findOne({
        client: clientId,
        serviceProvider: serviceProviderId,
        ticketType: ticketType,
        // Look for tickets created in the last 5 minutes
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
      }).populate('serviceProvider').sort({ createdAt: -1 });
      
      if (existingTicket) {
        return res.status(201).json({
          success: true,
          message: 'Existing ticket returned (duplicate request ID)',
          data: existingTicket
        });
      }
    } catch (err) {
      console.error('Error finding ticket for duplicate request ID:', err);
    }
    
    // If we couldn't find the ticket, still prevent duplicate creation
    return res.status(409).json({
      success: false,
      message: 'Duplicate request detected',
      error: 'This request has already been processed'
    });
  }
  
  // Create a unique key for this ticket request
  const requestKey = `${clientId}-${serviceProviderId}-${ticketType}`;
  
  // Check if we've recently created a ticket for this client-provider-type combination
  const now = Date.now();
  const recentCreation = recentTicketCreations.get(requestKey);
  
  // Check for tickets created today for this client-provider-type-specialty combination
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get the specialty for this ticket
    const ticketSpeciality = req.body.speciality || 'General';
    
    const existingTicket = await Ticket.findOne({
      client: clientId,
      serviceProvider: serviceProviderId,
      ticketType: ticketType,
      speciality: ticketSpeciality,
      createdAt: { $gte: today } // Created today
    }).populate('serviceProvider').sort({ createdAt: -1 });
    
    if (existingTicket) {
      // Found existing ticket in database
      
      // Update our in-memory tracking
      recentTicketCreations.set(requestKey, existingTicket.createdAt.getTime());
      
      // Return the existing ticket instead of creating a new one
      return res.status(201).json({
        success: true,
        message: 'Existing ticket returned',
        data: existingTicket
      });
    }
  } catch (err) {
    console.error('Error checking for existing tickets:', err);
    // Continue with normal ticket creation if there's an error
  }
  
  // Also check our in-memory tracking as a second layer of protection
  if (recentCreation && (now - recentCreation) < 30000) { // 30 seconds threshold
    // Duplicate ticket request detected in memory
    
    // Try again to find the ticket in the database
    try {
      const existingTicket = await Ticket.findOne({
        client: clientId,
        serviceProvider: serviceProviderId,
        ticketType: req.body.ticketType || 'consultation',
        createdAt: { $gte: new Date(Date.now() - 60000) } // Created in the last minute
      }).populate('serviceProvider').sort({ createdAt: -1 });
      
      if (existingTicket) {
        // Return existing ticket instead of creating a new one
        return res.status(201).json({
          success: true,
          message: 'Existing ticket returned',
          data: existingTicket
        });
      } else {
        // In-memory tracking indicated a recent ticket, but none found in database
      }
    } catch (err) {
      console.error('Error finding existing ticket:', err);
    }
  }
  
  // Update the timestamp for this request key
  recentTicketCreations.set(requestKey, now);
  
  // Clean up old entries from the map (older than 1 minute)
  for (const [key, timestamp] of recentTicketCreations.entries()) {
    if (now - timestamp > 60000) { // 1 minute
      recentTicketCreations.delete(key);
    }
  }
  
  try {
    const { clientName, speciality } = req.body;
    
    // Validate required fields
    if (!serviceProviderId) {
      return res.status(400).json({
        success: false,
        message: 'Service provider ID is required'
      });
    }
    
    if (!clientId && !clientName) {
      return res.status(400).json({
        success: false,
        message: 'Either client ID or client name is required'
      });
    }

    // Check if service provider exists first

    // We no longer check for existing tickets - allowing multiple tickets per client
    
    // Just log if there are existing tickets for informational purposes
    const existingTickets = await Ticket.find({
      client: clientId,
      serviceProvider: serviceProviderId,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's tickets only
      }
    });

    // Check if client already has tickets today (for information only)

    // Check if service provider exists
    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Get or create client record
    let client;
    if (clientId) {
      const user = await User.findById(clientId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // We no longer check for existing tickets for authenticated users
      console.log('Allowing authenticated users to have multiple tickets');
      
      client = await Client.findOne({ user: clientId });
      if (!client) {
        client = await Client.create({
          user: clientId,
          clientNumber: `CLT${Date.now()}`,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber
        });
      }
    } else {
      // Handle unauthenticated users
      if (!clientName) {
        return res.status(400).json({
          success: false,
          message: 'Client name is required for unauthenticated users'
        });
      }
      
      // Create a temporary client for unauthenticated users
      client = await Client.create({
        clientNumber: `TEMP${Date.now()}`,
        fullName: clientName,
        user: clientId
      });
    }

    // Initialize counters
    if (typeof serviceProvider.ticketCounter !== 'number') {
      serviceProvider.ticketCounter = 0;
    }
    if (typeof serviceProvider.waitingCount !== 'number') {
      serviceProvider.waitingCount = 0;
    }

    serviceProvider.ticketCounter++;
    serviceProvider.waitingCount++;
    await serviceProvider.save();

    // Create the ticket with speciality
    // Creating a new ticket
    
    let totalTickets = 0;
    let waitingTickets = 0;
    let clientTurn = 1;
    
    try {
      // Get the specialty for this ticket
      const ticketSpeciality = req.body.speciality || serviceProvider.speciality || 'General';
      
      // Get the total number of tickets for this service provider AND specialty
      totalTickets = await Ticket.countDocuments({
        serviceProvider: serviceProviderId,
        speciality: ticketSpeciality,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's tickets only
        }
      });
      // Successfully counted total tickets for specialty
      
      // Get the number of waiting tickets (not passed yet) for this specialty
      waitingTickets = await Ticket.countDocuments({
        serviceProvider: serviceProviderId,
        speciality: ticketSpeciality,
        status: 'not passed yet',
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's tickets only
        }
      });
      // Successfully counted waiting tickets for specialty
      
      // Calculate client turn (total + waiting list)
      clientTurn = totalTickets + 1; // Simplified calculation
      // Calculated client turn
    } catch (countError) {
      console.error('Error during ticket counting:', countError);
      // Continue with default values if counting fails
    }
    
    // Final values calculated
    
    // Get the specialty for this ticket
    const providerSpeciality = req.body.speciality || serviceProvider.speciality || 'General';
    
    // Create the ticket object with the new fields
    const ticketData = {
      client: client._id,
      serviceProvider: serviceProviderId,
      number: totalTickets + 1, // Number is specialty-specific
      status: 'not passed yet',
      speciality: providerSpeciality,  // Ensure there's always a speciality
      ticketType: req.body.ticketType || 'consultation',  // Default to consultation if not specified
      total: totalTickets + 1, // Total for this specialty
      waitingList: waitingTickets + 1, // Waiting list for this specialty
      clientTurn: clientTurn
    };
    
    const ticket = new Ticket(ticketData);
    
    // Validate the ticket before saving
    const validationError = ticket.validateSync();
    if (validationError) {
      console.error('Ticket validation error:', validationError);
      return res.status(400).json({
        success: false,
        message: 'Ticket validation failed',
        error: validationError
      });
    }
    
    // Ticket validation passed, attempting to save
    try {
      await ticket.save();
    } catch (saveError) {
      console.error('Error message:', saveError.message);
      console.error('Error stack:', saveError.stack);
      
      // Check for specific error types
      if (saveError.name === 'ValidationError') {
        console.error('Validation error details:', JSON.stringify(saveError.errors, null, 2));
      } else if (saveError.name === 'MongoServerError') {
        console.error('MongoDB server error code:', saveError.code);
        console.error('MongoDB server error codeName:', saveError.codeName);
      }
      
      // Return a more detailed error response instead of throwing
      return res.status(400).json({
        success: false,
        message: 'Error saving ticket',
        error: saveError.message,
        details: saveError.errors || {}
      });
    }

    try {
      await ticket.populate('serviceProvider');
    } catch (populateError) {
      // Error populating ticket - continue anyway
      // Continue even if population fails
    }

    // Add the ticket to our in-memory tracking
    recentTicketCreations.set(requestKey, now);
    
    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: {
        ...ticket.toObject(),
        waitingCount: serviceProvider.waitingCount
      }
    });

  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating ticket',
      error: err.message
    });
  }
};
// Get ticket stats for all workers
export const getTicketStats = async (req, res) => {
  try {
    console.log('Getting ticket stats with params:', req.query);
    
    const { serviceProvider, ticketType, speciality } = req.query;

    // Get today's start date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build query based on filters
    const query = {
      createdAt: { $gte: today }
    };
    
    if (serviceProvider) query.serviceProvider = serviceProvider;
    if (ticketType) query.ticketType = ticketType;
    if (speciality) query.speciality = speciality;

    console.log('Finding tickets with query:', query);

    // Get tickets for today
    const tickets = await Ticket.find(query);
    console.log('Found tickets:', tickets.length);

    // Calculate stats
    const stats = {
      serviceProvider,
      ticketType,
      speciality,
      waitingList: tickets.filter(t => t.status === 'not passed yet').length,
      passedList: tickets.filter(t => t.status === 'passed').length,
      dailyTickets: tickets.length,
      currentNumber: tickets.length > 0 ? 
        Math.max(...tickets.map(t => t.number)) : 0
    };

    console.log('Calculated stats:', stats);

    res.status(200).json({
      success: true,
      message: 'Ticket stats retrieved successfully',
      data: [stats] // Return as array for backward compatibility
    });
  } catch (err) {
    console.error('Error getting ticket stats:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};
// Get ticket status by ID
export const getTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const worker = await Worker.findOne({ speciality: ticket.speciality });
    const peopleBefore = worker.waitingList - worker.passedList;

    res.status(200).json({
      yourNumber: ticket.number,
      peopleBeforeYou: peopleBefore,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Increment passed ticket count
export const incrementPassedTickets = async (req, res) => {
  try {
    const { serviceProvider, ticketType, speciality } = req.body;
    console.log('Processing next ticket for:', { serviceProvider, ticketType, speciality });

    // Find earliest waiting ticket
    const nextTicket = await Ticket.findOne({
      serviceProvider,
      ticketType,
      speciality,
      status: 'not passed yet'
    }).sort({ createdAt: 1 });

    if (!nextTicket) {
      return res.status(404).json({
        success: false,
        message: 'No waiting tickets found'
      });
    }

    // Update ticket status to passed
    nextTicket.status = 'passed';
    await nextTicket.save();

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate updated stats
    const tickets = await Ticket.find({
      serviceProvider,
      ticketType,
      speciality,
      createdAt: { $gte: today }
    });

    const updatedStats = {
      waitingList: tickets.filter(t => t.status === 'not passed yet').length,
      passedList: tickets.filter(t => t.status === 'passed').length,
      dailyTickets: tickets.length,
      currentNumber: nextTicket.number,
      serviceProvider,
      ticketType,
      speciality
    };

    console.log('Updated stats:', updatedStats);

    res.status(200).json({
      success: true,
      message: 'Next ticket processed successfully',
      data: updatedStats
    });
  } catch (err) {
    console.error('Next ticket error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
// Update pauseTicketDemand to handle pause/resume
export const pauseTicketDemand = async (req, res) => {
  try {
    const { serviceProvider, ticketType, speciality } = req.body;
    const action = req.path.includes('pause') ? 'paused' : 'not passed yet';
    
    console.log(`${action === 'paused' ? 'Pausing' : 'Resuming'} tickets for:`, 
      { serviceProvider, ticketType, speciality });

    // Update all waiting tickets status
    await Ticket.updateMany(
      {
        serviceProvider,
        ticketType,
        speciality,
        status: action === 'paused' ? 'not passed yet' : 'paused'
      },
      { $set: { status: action } }
    );

    res.status(200).json({
      success: true,
      message: `Ticket system ${action === 'paused' ? 'paused' : 'resumed'} successfully`
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update resetDay to clear tickets
export const resetDay = async (req, res) => {
  try {
    const { serviceProvider, ticketType, speciality } = req.body;
    console.log('Resetting tickets for:', { serviceProvider, ticketType, speciality });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Delete all matching tickets from today
    await Ticket.deleteMany({
      serviceProvider,
      ticketType,
      speciality,
      createdAt: { $gte: today }
    });

    res.status(200).json({
      success: true,
      message: 'All tickets reset successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Check if a ticket already exists for a client and service provider
export const checkExistingTicket = async (req, res) => {
  
  try {
    const { client, serviceProvider } = req.query;
    
    if (!client || !serviceProvider) {
      return res.status(400).json({
        success: false,
        message: 'Client ID and Service Provider ID are required'
      });
    }
    
    // Look for a ticket created today for this client and service provider
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingTicket = await Ticket.findOne({
      client: client,
      serviceProvider: serviceProvider,
      ticketType: 'consultation',
      createdAt: { $gte: today }
    }).populate('serviceProvider');
    
    // Check if existing ticket was found
    
    if (existingTicket) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: 'Existing ticket found',
        ticket: existingTicket
      });
    }
    
    return res.status(200).json({
      success: true,
      exists: false,
      message: 'No existing ticket found'
    });
  } catch (error) {
    console.error('Error checking for existing ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking for existing ticket',
      error: error.message
    });
  }
};
