import AccountDemand from '../models/accountDemand.model.js';
import ServiceProvider from '../models/serviceProvider.model.js';

export const createAccountDemand = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      wilaya,
      type,
      speciality,
      password,
      confirmPassword,
      directorId
    } = req.body;

    if (!directorId || directorId.length < 4 || directorId.length > 18) {
      return res.status(400).json({
        success: false,
        message: 'Director ID must be between 4 and 18 characters'
      });
    }

    if (type === 'cabine' && !speciality) {
      return res.status(400).json({
        success: false,
        message: 'Speciality is required for type "cabine"'
      });
    }

    const existingDemand = await AccountDemand.findOne({ email });
    if (existingDemand) {
      return res.status(400).json({
        success: false,
        message: 'A demand with this email already exists'
      });
    }

    const demand = await AccountDemand.create({
      fullName,
      email,
      wilaya,
      type,
      speciality,
      password,
      confirmPassword,
      directorId
    });

    res.status(201).json({
      success: true,
      message: 'Account demand submitted successfully',
      data: demand
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAccountDemands = async (req, res, next) => {
  try {
    const demands = await AccountDemand.find();
    res.status(200).json({ success: true, data: demands });
  } catch (error) {
    next(error);
  }
};

export const approveAccountDemand = async (req, res, next) => {
  try {
    const demand = await AccountDemand.findById(req.params.id);
    if (!demand) {
      return res.status(404).json({ success: false, message: 'Demand not found' });
    }

    const serviceProvider = await ServiceProvider.create({
      name: demand.fullName,
      email: demand.email,
      password: demand.password,
      confirmPassword: demand.password,
      wilaya: demand.wilaya,
      directorId: demand.directorId,
      type: demand.type,
      speciality: demand.speciality || undefined
    });

    await AccountDemand.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: 'Account approved and service provider created',
      data: serviceProvider
    });
  } catch (error) {
    next(error);
  }
};

export const rejectAccountDemand = async (req, res, next) => {
  try {
    const demand = await AccountDemand.findById(req.params.id);
    if (!demand) {
      return res.status(404).json({ success: false, message: 'Demand not found' });
    }

    await AccountDemand.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Account demand rejected' });
  } catch (error) {
    next(error);
  }
};
