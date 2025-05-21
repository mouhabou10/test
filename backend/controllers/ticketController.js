import Ticket from '../models/ticket.model.js';
import ServiceProvider from '../models/serviceProvider.model.js';
import Client from '../models/client.model.js';
import User from '../models/user.model.js';
import Worker from '../models/worker.model.js';

// Create a ticket for a client
export const createTicket = async (req, res) => {
  try {
    const { serviceProvider: serviceProviderId, client: clientId } = req.body;

    // Check for existing active ticket
    const existingTicket = await Ticket.findOne({
      client: clientId,
      serviceProvider: serviceProviderId,
      status: { $in: ['pending', 'confirmed'] },
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's tickets only
      }
    });

    if (existingTicket) {
      await existingTicket.populate('serviceProvider');
      const provider = await ServiceProvider.findById(serviceProviderId);
      return res.status(200).json({
        success: true,
        message: 'Retrieved existing ticket',
        data: {
          ...existingTicket.toObject(),
          waitingCount: provider.waitingCount
        }
      });
    }

    // Check if service provider exists
    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Check if user exists
    const user = await User.findById(clientId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get or create client record
    let client = await Client.findOne({ user: clientId });
    if (!client) {
      client = await Client.create({
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
 // Create the ticket with speciality
const ticket = new Ticket({
  client: client._id,
  serviceProvider: serviceProviderId,
  number: serviceProvider.ticketCounter,
  status: 'pending',
  speciality: req.body.speciality || serviceProvider.speciality  // <-- ✅ allow manual override
});


    await ticket.save();
    await ticket.populate('serviceProvider');

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
