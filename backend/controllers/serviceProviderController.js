import ServiceProvider from '../models/serviceProvider.model.js';
import Speciality from '../models/specialty.model.js';
import mongoose from 'mongoose';

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

// ─── SEARCH SERVICE PROVIDERS ──────────────────────────────────────────────
export const searchServiceProviders = async (req, res, next) => {
  try {
    // Get search parameters from query
    const { wilaya, speciality, type } = req.query;
    
    // Build filter object for MongoDB query
    const filter = {};
    
    // Add wilaya filter if provided
    if (wilaya) {
      filter.wilaya = { $regex: wilaya, $options: 'i' }; // Case-insensitive search
    }
    
    // Add type filter if provided
    if (type) {
      // Validate the type parameter
      if (!['hospital', 'cabine', 'clinic'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid type. Type must be hospital, cabine, or clinic'
        });
      }
      filter.type = type;
    }
    
    // Handle specialty search based on provider type
    if (speciality) {
      let specialityId;
      
      // Try to find the specialty ID if it exists in the Speciality collection
      if (mongoose.Types.ObjectId.isValid(speciality)) {
        specialityId = speciality;
      } else {
        try {
          const foundSpeciality = await Speciality.findOne({ 
            name: { $regex: speciality, $options: 'i' } 
          });
          
          if (foundSpeciality) {
            specialityId = foundSpeciality._id;
          }
        } catch (err) {
          // Continue with search even if no matching specialty found
        }
      }
      
      // Create a query that matches both cabines with speciality string
      // and hospitals/clinics with speciality ObjectId
      const specialityConditions = [
        // For cabines (direct string match)
        { 
          type: 'cabine', 
          speciality: { $regex: speciality, $options: 'i' } 
        }
      ];
      
      // For hospitals and clinics (ObjectId in array)
      if (specialityId) {
        specialityConditions.push({ 
          type: { $in: ['hospital', 'clinic'] }, 
          specialities: specialityId 
        });
      }
      
      // Add the OR condition to the filter
      filter.$or = specialityConditions;
    }
    
    // Execute query with built filters
    const serviceProviders = await ServiceProvider.find(filter)
      .populate('specialities', 'name')
      .populate('workers');
    
    // Return results
    res.status(200).json({
      success: true,
      count: serviceProviders.length,
      data: serviceProviders
    });
  } catch (error) {
    next(error);
  }
};