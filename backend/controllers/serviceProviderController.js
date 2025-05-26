import ServiceProvider from '../models/serviceProvider.model.js';
import Speciality from '../models/specialty.model.js';
import mongoose from 'mongoose';
import Worker from '../models/worker.model.js';

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
export const getServiceProviderSpecialities = async (req, res, next) => {
  try {
    const { id } = req.params;
    const serviceProvider = await ServiceProvider.findById(id).populate('specialities', 'name');
    if (!serviceProvider) {
      return res.status(404).json({ success: false, message: 'Service provider not found' });
    }
    res.status(200).json({ success: true, data: serviceProvider.specialities });
  } catch (error) {
    next(error);
  }
};
export const assignSpecialityToServiceProvider = async (req, res, next) => {
  try {
    const { id } = req.params; // Service provider ID
    const { specialityId } = req.body; // Speciality ID to assign

    const serviceProvider = await ServiceProvider.findById(id);
    if (!serviceProvider) {
      return res.status(404).json({ success: false, message: 'Service provider not found' });
    }

    // Check if the speciality is already assigned
    if (!serviceProvider.specialities.includes(specialityId)) {
      serviceProvider.specialities.push(specialityId);
      await serviceProvider.save();
    }

    res.status(200).json({ success: true, message: 'Speciality assigned successfully' });
  } catch (error) {
    next(error);
  }
};
export const syncWorkersToServiceProvider = async (serviceProviderId) => {
  try {
    // Find all workers already assigned to this service provider
    const workers = await Worker.find({ serviceProvider: serviceProviderId });

    // Update the service provider to include these workers
    await ServiceProvider.findByIdAndUpdate(
      serviceProviderId,
      { $set: { workers: workers.map(w => w._id) } },
      { new: true }
    );

    return workers;
  } catch (error) {
    throw error;
  }
};
// ─── WORKER RETRIEVAL & SYNC ──────────────────────────────────────────────
export const getWorkersForProvider = async (serviceProviderId) => {
  try {
    const workers = await Worker.find({ serviceProvider: serviceProviderId })
      .populate('user', 'fullName email phoneNumber role')
      .lean();

    await ServiceProvider.findByIdAndUpdate(
      serviceProviderId,
      { $set: { workers: workers.map(w => w._id) } },
      { new: true }
    );

    return workers;
  } catch (error) {
    throw error;
  }
};

export const syncWorkersForAllProviders = async (req, res, next) => {
  try {
    const providers = await ServiceProvider.find();
    await Promise.all(providers.map(async (provider) => {
      await getWorkersForProvider(provider._id);
    }));
    res.status(200).json({
      success: true,
      message: 'Workers synced successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ONE ──────────────────────────────────────────────────────────────
export const getServiceProviderById = async (req, res, next) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate('specialities');

    if (!provider) {
      throw new Error('Service provider not found');
    }

    const workers = await getWorkersForProvider(provider._id);

    res.status(200).json({
      success: true,
      data: {
        ...provider.toObject(),
        workers
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL ──────────────────────────────────────────────────────────────
export const getAllServiceProviders = async (req, res, next) => {
  try {
    const providers = await ServiceProvider.find()
      .populate('specialities');

    const providersWithWorkers = await Promise.all(
      providers.map(async (provider) => {
        const workers = await getWorkersForProvider(provider._id);
        return {
          ...provider.toObject(),
          workers
        };
      })
    );

    res.status(200).json({
      success: true,
      data: providersWithWorkers
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET WORKERS BY PROVIDER ──────────────────────────────────────────────
export const getWorkersByServiceProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const workers = await Worker.find({ serviceProvider: id })
      .populate('user', 'fullName email phoneNumber role')
      .populate('serviceProvider', 'name');

    res.status(200).json({
      success: true,
      data: workers
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────
export const deleteServiceProvider = async (req, res, next) => {
  try {
    await ServiceProvider.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Service provider deleted' });
  } catch (error) {
    next(error);
  }
};
export const assignExistingWorkersToProvider = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    // Find workers that already reference this provider
    const workers = await Worker.find({ serviceProvider: providerId });

    const workerIds = workers.map(w => w._id);

    // Update the provider's workers array
    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      providerId,
      { $set: { workers: workerIds } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Workers assigned to provider',
      data: updatedProvider
    });
  } catch (error) {
    next(error);
  }
};

// ─── SEARCH ───────────────────────────────────────────────────────────────
export const searchServiceProviders = async (req, res, next) => {
  try {
    const { wilaya, speciality, type } = req.query;
    const filter = {};

    if (wilaya) {
      filter.wilaya = { $regex: wilaya, $options: 'i' };
    }

    if (type) {
      if (!['hospital', 'cabine', 'clinic'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid type. Type must be hospital, cabine, or clinic'
        });
      }
      filter.type = type;
    }

    if (speciality) {
      let specialityId;
      if (mongoose.Types.ObjectId.isValid(speciality)) {
        specialityId = speciality;
      } else {
        const foundSpeciality = await Speciality.findOne({ 
          name: { $regex: speciality, $options: 'i' } 
        });
        if (foundSpeciality) {
          specialityId = foundSpeciality._id;
        }
      }

      const specialityConditions = [
        { type: 'cabine', speciality: { $regex: speciality, $options: 'i' } }
      ];

      if (specialityId) {
        specialityConditions.push({ 
          type: { $in: ['hospital', 'clinic'] }, 
          specialities: specialityId 
        });
      }

      filter.$or = specialityConditions;
    }

    const serviceProviders = await ServiceProvider.find(filter)
      .populate('specialities', 'name');

    const providersWithWorkers = await Promise.all(
      serviceProviders.map(async (provider) => {
        const workers = await getWorkersForProvider(provider._id);
        return {
          ...provider.toObject(),
          workers
        };
      })
    );

    res.status(200).json({
      success: true,
      count: providersWithWorkers.length,
      data: providersWithWorkers
    });
  } catch (error) {
    next(error);
  }
};
