import Speciality from '../models/specialty.model.js';  // Make sure this path is correct

// ─── CREATE SPECIALITY ─────────────────────────────────────────────────────
export const createSpeciality = async (req, res, next) => {
  try {
    const { name } = req.body;

    const speciality = await Speciality.create({ name });

    res.status(201).json({
      success: true,
      message: 'Speciality created successfully',
      data: speciality
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL SPECIALITIES ──────────────────────────────────────────────────
export const getAllSpecialities = async (req, res, next) => {
  try {
    const specialities = await Speciality.find();
    res.status(200).json({ success: true, data: specialities });
  } catch (error) {
    next(error);
  }
};

// ─── GET SPECIALITY BY ID ──────────────────────────────────────────────────
export const getSpecialityById = async (req, res, next) => {
  try {
    const speciality = await Speciality.findById(req.params.id);
    if (!speciality) {
      return res.status(404).json({ success: false, message: 'Speciality not found' });
    }

    res.status(200).json({ success: true, data: speciality });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE SPECIALITY ─────────────────────────────────────────────────────
export const deleteSpeciality = async (req, res, next) => {
  try {
    const deleted = await Speciality.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Speciality not found' });
    }

    res.status(200).json({ success: true, message: 'Speciality deleted' });
  } catch (error) {
    next(error);
  }
};
