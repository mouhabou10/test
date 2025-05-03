// TicketController.js
import Ticket from '../models/Ticket.js';
import Worker from '../models/Worker.js';
import Speciality from '../models/Speciality.js';

// Create a ticket for a client
export const createTicket = async (req, res) => {
  try {
    const { specialityId } = req.body;

    // Ensure the speciality exists
    const speciality = await Speciality.findById(specialityId);
    if (!speciality) return res.status(404).json({ message: 'Speciality not found' });

    // Find the worker (agent) handling this speciality
    const worker = await Worker.findOne({ speciality: specialityId });
    if (!worker) return res.status(404).json({ message: 'No agent for this speciality' });

    if (worker.ticketDemandPaused) {
      return res.status(403).json({ message: 'Ticket demand is paused for this speciality' });
    }

    // Increment waiting list
    worker.waitingList += 1;
    await worker.save();

    const ticketNumber = worker.waitingList + worker.passedList;

    // Create and save ticket
    const ticket = new Ticket({
      speciality: specialityId,
      number: ticketNumber,
      date: new Date(),
    });
    await ticket.save();

    res.status(201).json({
      message: 'Ticket created successfully',
      ticketNumber: ticket.number,
      peopleBeforeYou: worker.waitingList - 1,
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

// Increment passed list (agent clicks "next")
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

// Reset day (delete today's tickets and reset counters)
export const resetDay = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id);
    if (!worker) return res.status(404).json({ message: 'Agent not found' });

    // Delete all today's tickets for the worker's speciality
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Ticket.deleteMany({
      speciality: worker.speciality,
      date: { $gte: today }
    });

    worker.waitingList = 0;
    worker.passedList = 0;
    await worker.save();

    res.status(200).json({ message: 'Day reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
