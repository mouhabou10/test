import Manager from '../models/manager.model.js';
import Service from '../models/specialty.model.js'; // Assuming you renamed it from Service to Speciality
// controllers/managerController.js
import User from '../models/user.model.js';

// ─── CREATE WORKER ─────────────────────────────────────────────────────────
export const createWorker = async (req, res, next) => {
  try {
    const { userId, fullName, email, phoneNumber, password } = req.body;

    const worker = await User.create({
      userId,
      fullName,
      email,
      phoneNumber,
      password,
      role: 'worker',
    });

    res.status(201).json({ success: true, message: 'Worker created', data: worker });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL WORKERS ───────────────────────────────────────────────────────
export const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await User.find({ role: 'worker' });
    res.status(200).json({ success: true, data: workers });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE WORKER ─────────────────────────────────────────────────────────
export const updateWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const worker = await User.findOneAndUpdate(
      { _id: id, role: 'worker' },
      updates,
      { new: true }
    );

    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

    res.status(200).json({ success: true, message: 'Worker updated', data: worker });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE WORKER ─────────────────────────────────────────────────────────
export const deleteWorker = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await User.findOneAndDelete({ _id: id, role: 'worker' });

    if (!deleted) return res.status(404).json({ success: false, message: 'Worker not found' });

    res.status(200).json({ success: true, message: 'Worker deleted' });
  } catch (error) {
    next(error);
  }
};

// ─── CREATE SERVICE ───────────────────────────────────────────────────────
export const createService = async (req, res, next) => {
  try {
    const { name } = req.body;
    const service = await Service.create({ name });
    res.status(201).json({ success: true, message: 'Service created', data: service });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE SERVICE ───────────────────────────────────────────────────────
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const service = await Service.findByIdAndUpdate(id, { name }, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    res.status(200).json({ success: true, message: 'Service updated', data: service });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE SERVICE ───────────────────────────────────────────────────────
export const deleteService = async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};

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
