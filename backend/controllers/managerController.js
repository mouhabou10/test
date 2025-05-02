import Manager from '../models/Manager.js';

// ─── CREATE MANAGER ───────────────────────────────────────────────────────
export const createManager = async (req, res, next) => {
  try {
    const { id, fullname, email, serviceId } = req.body;
    const manager = await Manager.create({ id, fullname, email, serviceId });
    res.status(201).json({ success: true, message: 'Manager created', data: manager });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL MANAGERS ─────────────────────────────────────────────────────
export const getAllManagers = async (req, res, next) => {
  try {
    const managers = await Manager.find();
    res.status(200).json({ success: true, data: managers });
  } catch (error) {
    next(error);
  }
};

// ─── GET MANAGER BY ID ────────────────────────────────────────────────────
export const getManagerById = async (req, res, next) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) throw new Error('Manager not found');
    res.status(200).json({ success: true, data: manager });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE MANAGER ───────────────────────────────────────────────────────
export const deleteManager = async (req, res, next) => {
  try {
    await Manager.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Manager deleted' });
  } catch (error) {
    next(error);
  }
};
