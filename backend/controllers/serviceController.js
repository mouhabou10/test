import Service from '../models/Service.js';

// ─── CREATE SERVICE ───────────────────────────────────────────────────────
export const createService = async (req, res, next) => {
  try {
    const { id, name, description } = req.body;
    const service = await Service.create({ id, name, description });
    res.status(201).json({ success: true, message: 'Service created', data: service });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL SERVICES ─────────────────────────────────────────────────────
export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
};

// ─── GET SERVICE BY ID ────────────────────────────────────────────────────
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) throw new Error('Service not found');
    res.status(200).json({ success: true, data: service });
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
