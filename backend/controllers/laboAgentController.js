import LaboTicket from '../models/LaboTicket.js';
import LaboPrescription from '../models/LaboPrescription.js';

// Upload lab result
export const uploadLabResult = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { resultFileUrl } = req.body;

    const updated = await LaboTicket.findByIdAndUpdate(
      ticketId,
      { result: resultFileUrl, status: 'completed' },
      { new: true }
    );

    res.json({ success: true, message: 'Result uploaded', data: updated });
  } catch (error) {
    next(error);
  }
};

// Manage lab prescription
export const updateLabPrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const { status } = req.body;

    const updated = await LaboPrescription.findByIdAndUpdate(
      prescriptionId,
      { status },
      { new: true }
    );

    res.json({ success: true, message: 'Prescription updated', data: updated });
  } catch (error) {
    next(error);
  }
};
