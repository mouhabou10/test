import RadioTicket from '../models/RadioTicket.js';
import RadioPrescription from '../models/RadioPrescription.js';

// Upload radio result
export const uploadRadioResult = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { resultFileUrl } = req.body;

    const updated = await RadioTicket.findByIdAndUpdate(
      ticketId,
      { result: resultFileUrl, status: 'completed' },
      { new: true }
    );

    res.json({ success: true, message: 'Radiology result uploaded', data: updated });
  } catch (error) {
    next(error);
  }
};

// Manage radio prescription
export const updateRadioPrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const { status } = req.body;

    const updated = await RadioPrescription.findByIdAndUpdate(
      prescriptionId,
      { status },
      { new: true }
    );

    res.json({ success: true, message: 'Radiology prescription updated', data: updated });
  } catch (error) {
    next(error);
  }
};
