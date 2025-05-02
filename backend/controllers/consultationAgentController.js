import ConsultationTicket from '../models/ConsultationTicket.js';

// Increment a consultation ticket (e.g., assign a new one to a doctor)
export const assignNextConsultation = async (req, res, next) => {
  try {
    const ticket = await ConsultationTicket.findOneAndUpdate(
      { status: 'pending' },
      { status: 'in_progress' },
      { new: true, sort: { createdAt: 1 } }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'No pending consultation tickets' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// Pause the demand (block new tickets from being created)
export const pauseConsultationDemand = async (req, res, next) => {
  try {
    // In practice, use a config collection to store this state
    global.consultationPaused = true;

    res.json({ success: true, message: 'Consultation demand paused' });
  } catch (error) {
    next(error);
  }
};

// Reset all tickets at end of day
export const resetConsultationTickets = async (req, res, next) => {
  try {
    await ConsultationTicket.deleteMany({});

    res.json({ success: true, message: 'Consultation tickets reset for the day' });
  } catch (error) {
    next(error);
  }
};
