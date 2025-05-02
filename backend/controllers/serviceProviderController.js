import ServiceProvider from '../models/ServiceProvider.js';

// ─── CREATE SERVICE PROVIDER ──────────────────────────────────────────────
export const createServiceProvider = async (req, res, next) => {
  try {
    const { id, name, contactInfo, serviceId } = req.body;
    const provider = await ServiceProvider.create({ id, name, contactInfo, serviceId });
    res.status(201).json({ success: true, message: 'Service provider created', data: provider });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL SERVICE PROVIDERS ────────────────────────────────────────────
export const getAllServiceProviders = async (req, res, next) => {
  try {
    const providers = await ServiceProvider.find();
    res.status(200).json({ success: true, data: providers });
  } catch (error) {
    next(error);
  }
};

// ─── GET SERVICE PROVIDER BY ID ───────────────────────────────────────────
export const getServiceProviderById = async (req, res, next) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) throw new Error('Service provider not found');
    res.status(200).json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE SERVICE PROVIDER ──────────────────────────────────────────────
export const deleteServiceProvider = async (req, res, next) => {
  try {
    await ServiceProvider.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Service provider deleted' });
  } catch (error) {
    next(error);
  }
};
