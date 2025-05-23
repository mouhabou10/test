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
    const workers = await Worker.find();

    const stats = workers.map(worker => ({
      speciality: worker.speciality,
      passedTickets: worker.passedList,
      waitingList: worker.waitingList,
      dailyTickets: worker.passedList + worker.waitingList
    }));

    res.status(200).json({
      success: true,
      message: 'Ticket stats retrieved successfully',
      data: stats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const { id } = req.params;
    const worker = await Worker.findById(id);
    if (!worker) return res.status(404).json({ message: 'Agent not found' });

    if (worker.waitingList > 0) {
      worker.passedList += 1;
      worker.waitingList -= 1;
      await worker.save();
    }

    res.status(200).json({ message: 'Passed ticket count incremented' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pause ticket demand
export const pauseTicketDemand = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id);
    if (!worker) return res.status(404).json({ message: 'Agent not found' });

    worker.ticketDemandPaused = true;
    await worker.save();
    res.status(200).json({ message: 'Ticket demand paused' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset ticket day (delete today’s tickets & reset counters)
export const resetDay = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id);
    if (!worker) return res.status(404).json({ message: 'Agent not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Ticket.deleteMany({
      speciality: worker.speciality,
      createdAt: { $gte: today } // 
    });

    worker.waitingList = 0;
    worker.passedList = 0;
    await worker.save();

    res.status(200).json({ message: 'Day reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
