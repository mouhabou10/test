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
      speciality,        // For 'cabine'
      specialities       // For 'hospital' or 'clinic'
    } = req.body;

    // Validate required fields based on type
    if (type === 'cabine' && !speciality) {
      return res.status(400).json({
        success: false,
        message: 'Speciality is required for service providers of type "cabine"'
      });
    }

    if ((type === 'hospital' || type === 'clinic') && (!specialities || !specialities.length)) {
      return res.status(400).json({
        success: false,
        message: 'Specialities are required for service providers of type "hospital" or "clinic"'
      });
    }

    const providerData = {
      name,
      email,
      password,
      confirmPassword,
      wilaya,
      directorId,
      type
    };

    if (type === 'cabine') {
      providerData.speciality = speciality;
    } else {
      providerData.specialities = specialities;
    }

    const provider = await ServiceProvider.create(providerData);

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
    const providers = await ServiceProvider.find().populate('specialities workers');
    res.status(200).json({ success: true, data: providers });
  } catch (error) {
    next(error);
  }
};

// ─── GET SERVICE PROVIDER BY ID ───────────────────────────────────────────
export const getServiceProviderById = async (req, res, next) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).populate('specialities workers');
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
