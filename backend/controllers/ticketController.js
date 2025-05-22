import Ticket from '../models/ticket.model.js';
import ServiceProvider from '../models/serviceProvider.model.js';
import Client from '../models/client.model.js';
import User from '../models/user.model.js';
import Worker from '../models/worker.model.js';

// Track recent ticket creations to prevent duplicates
const recentTicketCreations = new Map();

// Create a ticket for a client
export const createTicket = async (req, res) => {
  console.log('==================================================');
  console.log('CREATE TICKET REQUEST RECEIVED');
  console.log('==================================================');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  
  // Extract client and service provider IDs
  const clientId = req.body.client;
  const serviceProviderId = req.body.serviceProvider;
  
  // Create a unique key for this ticket request
  const requestKey = `${clientId}-${serviceProviderId}-${req.body.ticketType || 'consultation'}`;
  
  // Check if we've recently created a ticket for this client-provider-type combination
  const now = Date.now();
  const recentCreation = recentTicketCreations.get(requestKey);
  
  // Always check for recent tickets in the database regardless of our in-memory tracking
  // This handles cases where the server was restarted or the in-memory map was cleared
  try {
    console.log('Checking for recent tickets in the database...');
    const existingTicket = await Ticket.findOne({
      client: clientId,
      serviceProvider: serviceProviderId,
      ticketType: req.body.ticketType || 'consultation',
      createdAt: { $gte: new Date(Date.now() - 30000) } // Created in the last 30 seconds
    }).populate('serviceProvider').sort({ createdAt: -1 });
    
    if (existingTicket) {
      console.log('DUPLICATE PREVENTION: Found recent ticket in database');
      console.log(`Ticket was created at ${existingTicket.createdAt}, ${Date.now() - existingTicket.createdAt.getTime()}ms ago`);
      
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
    console.log('DUPLICATE TICKET REQUEST DETECTED IN MEMORY');
    console.log(`Previous request was ${now - recentCreation}ms ago`);
    
    // Try again to find the ticket in the database
    try {
      const existingTicket = await Ticket.findOne({
        client: clientId,
        serviceProvider: serviceProviderId,
        ticketType: req.body.ticketType || 'consultation',
        createdAt: { $gte: new Date(Date.now() - 60000) } // Created in the last minute
      }).populate('serviceProvider').sort({ createdAt: -1 });
      
      if (existingTicket) {
        console.log('Found existing ticket, returning it instead of creating a new one');
        return res.status(201).json({
          success: true,
          message: 'Existing ticket returned',
          data: existingTicket
        });
      } else {
        console.log('WARNING: In-memory tracking indicated a recent ticket, but none found in database');
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
    const { serviceProvider: serviceProviderId, client: clientId, clientName, speciality, ticketType } = req.body;
    
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
    console.log('Allowing multiple tickets per client - not checking for existing tickets');
    
    // Just log if there are existing tickets for informational purposes
    const existingTickets = await Ticket.find({
      client: clientId,
      serviceProvider: serviceProviderId,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's tickets only
      }
    });

    if (existingTickets.length > 0) {
      console.log(`Client already has ${existingTickets.length} tickets for this service provider today`);
    }

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
        user: clientId,
        clientNumber: `CLT${Date.now()}`,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber
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
    console.log('==================================================');
    console.log('CREATING TICKET');
    console.log('==================================================');
    console.log('Client ID:', client._id, 'Type:', typeof client._id);
    console.log('Service Provider ID:', serviceProviderId, 'Type:', typeof serviceProviderId);
    console.log('Ticket Number:', serviceProvider.ticketCounter, 'Type:', typeof serviceProvider.ticketCounter);
    console.log('Speciality:', req.body.speciality || serviceProvider.speciality || 'General');
    
    // Check if the Ticket model is properly defined
    console.log('Ticket model schema:', JSON.stringify(Ticket.schema.paths, null, 2));
    
    // For now, let's skip the complex calculations that might be causing issues
    console.log('DEBUG: Skipping complex calculations for total, waitingList, and clientTurn');
    
    let totalTickets = 0;
    let waitingTickets = 0;
    let clientTurn = 1;
    
    try {
      // Get the total number of tickets for this service provider and type
      totalTickets = await Ticket.countDocuments({
        serviceProvider: serviceProviderId,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's tickets only
        }
      });
      console.log('DEBUG: Successfully counted total tickets:', totalTickets);
      
      // Get the number of waiting tickets (not passed yet)
      waitingTickets = await Ticket.countDocuments({
        serviceProvider: serviceProviderId,
        status: 'not passed yet',
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's tickets only
        }
      });
      console.log('DEBUG: Successfully counted waiting tickets:', waitingTickets);
      
      // Calculate client turn (total + waiting list)
      clientTurn = totalTickets + 1; // Simplified calculation
      console.log('DEBUG: Calculated client turn:', clientTurn);
    } catch (countError) {
      console.error('DEBUG: Error during ticket counting:', countError);
      // Continue with default values if counting fails
    }
    
    console.log('DEBUG: Final values - Total tickets:', totalTickets);
    console.log('DEBUG: Final values - Waiting tickets:', waitingTickets);
    console.log('DEBUG: Final values - Client turn:', clientTurn);
    
    // Create the ticket object with the new fields
    const ticketData = {
      client: client._id,
      serviceProvider: serviceProviderId,
      number: serviceProvider.ticketCounter,
      status: 'not passed yet',
      speciality: req.body.speciality || serviceProvider.speciality || 'General',  // Ensure there's always a speciality
      ticketType: req.body.ticketType || 'consultation',  // Default to consultation if not specified
      total: totalTickets + 1,
      waitingList: waitingTickets + 1,
      clientTurn: clientTurn
    };
    
    console.log('DEBUG: Created ticket data object');
    console.log('DEBUG: Ticket client:', ticketData.client);
    console.log('DEBUG: Ticket service provider:', ticketData.serviceProvider);
    console.log('DEBUG: Ticket number:', ticketData.number);
    console.log('DEBUG: Ticket status:', ticketData.status);
    console.log('DEBUG: Ticket speciality:', ticketData.speciality);
    console.log('DEBUG: Ticket type:', ticketData.ticketType);
    
    console.log('Ticket data to be saved:', JSON.stringify(ticketData, null, 2));
    
    const ticket = new Ticket(ticketData);
    console.log('Ticket model instance created');
    
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
    
    console.log('Ticket validation passed, attempting to save...');
    
    try {
      console.log('DEBUG: About to save ticket to database');
      console.log('DEBUG: Ticket model instance:', ticket);
      console.log('DEBUG: Ticket model methods available:', Object.keys(ticket.__proto__));
      
      // Try to save with a timeout to catch hanging operations
      const savePromise = ticket.save();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Ticket save operation timed out')), 5000);
      });
      
      // Race the save operation against the timeout
      const savedTicket = await Promise.race([savePromise, timeoutPromise]);
      
      console.log('==================================================');
      console.log('TICKET SAVED SUCCESSFULLY');
      console.log('==================================================');
      console.log('Ticket ID:', savedTicket._id);
      console.log('Saved ticket data:', JSON.stringify(savedTicket.toObject(), null, 2));
    } catch (saveError) {
      console.error('==================================================');
      console.error('ERROR SAVING TICKET');
      console.error('==================================================');
      console.error('Error name:', saveError.name);
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
      console.error('Error populating ticket:', populateError);
      // Continue even if population fails
    }

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
      createdAt: { $gte: today } // ✅ fixed field name
    });

    worker.waitingList = 0;
    worker.passedList = 0;
    await worker.save();

    res.status(200).json({ message: 'Day reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
