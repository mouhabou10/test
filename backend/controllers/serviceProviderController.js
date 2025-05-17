import ServiceProvider from '../models/serviceProvider.model.js';


// ─── CREATE SERVICE PROVIDER ──────────────────────────────────────────────
export const createServiceProvider = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      wilaya,
      directorId,
      type,
      speciality
    } = req.body;

    // Validate: speciality is required only if type is 'cabine'
    if (type === 'cabine' && !speciality) {
      return res.status(400).json({
        success: false,
        message: 'Speciality is required for service providers of type "cabine"'
      });
    }

    const provider = await ServiceProvider.create({
      name,
      email,
      password,
      confirmPassword,
      wilaya,
      directorId,
      type,
      speciality: type === 'cabine' ? speciality : undefined // optional cleanup
    });

    res.status(201).json({
      success: true,
      message: 'Service provider created',
      data: provider
    });
  } catch (error) {
    next(error);
  }
};


// ─── GET ALL SERVICE PROVIDERS ────────────────────────────────────────────
export const getAllServiceProviders = async (req, res, next) => {
  try {
    const providers = await ServiceProvider.find().populate('speciality directorId workers');
    res.status(200).json({ success: true, data: providers });
  } catch (error) {
    next(error);
  }
};

// ─── GET SERVICE PROVIDER BY ID ───────────────────────────────────────────
export const getServiceProviderById = async (req, res, next) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).populate('speciality directorId workers');
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
