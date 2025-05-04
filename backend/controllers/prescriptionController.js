import Prescription from '../models/prescription.model.js';

// ─── CREATE PRESCRIPTION ──────────────────────────────────────────────────
export const createPrescription = async (req, res, next) => {
  try {
    const { id, doctorId, patientId, date, medications } = req.body;
    const prescription = await Prescription.create({ id, doctorId, patientId, date, medications });
    res.status(201).json({ success: true, message: 'Prescription created', data: prescription });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL PRESCRIPTIONS ────────────────────────────────────────────────
export const getAllPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    next(error);
  }
};

// ─── GET PRESCRIPTION BY ID ───────────────────────────────────────────────
export const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) throw new Error('Prescription not found');
    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE PRESCRIPTION ──────────────────────────────────────────────────
export const deletePrescription = async (req, res, next) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Prescription deleted' });
  } catch (error) {
    next(error);
  }
};
