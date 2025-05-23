import AccountDemand from '../models/accountDemand.model.js';
import ServiceProvider from '../models/serviceProvider.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

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

export const approveAccountDemand = async (req, res) => {
  try {
    const demand = await AccountDemand.findById(req.params.id);
    if (!demand) {
      return res.status(404).json({ success: false, message: 'Account demand not found' });
    }

    // Generate a valid Algerian 10-digit phone number: 0[5-7]XXXXXXXX
    const generatePhoneNumber = () => {
      const secondDigit = Math.floor(Math.random() * 3) + 5; // yields 5,6, or 7
      let phone = '0' + secondDigit;
      for (let i = 0; i < 8; i++) {
        phone += Math.floor(Math.random() * 10);
      }
      return phone;
    };

    // Create user
    const newUser = await User.create({
      email: demand.email,
      password: demand.password,
      confirmPassword: demand.confirmPassword,
      role: 'serviceProvider',
      phoneNumber: generatePhoneNumber()
    });

    // Create service provider
    const newProvider = await ServiceProvider.create({
      name: demand.fullName,
      email: demand.email,
      password: demand.password,
      confirmPassword: demand.confirmPassword,
      wilaya: demand.wilaya,
      type: demand.type,
      speciality: demand.type === 'cabine' ? demand.speciality : undefined,
      specialities: demand.type !== 'cabine' ? demand.specialities : [],
      directorId: demand.directorId,
      userId: newUser._id
    });

    // Delete demand after approval
    await AccountDemand.findByIdAndDelete(demand._id);

    res.status(200).json({ success: true, message: 'Account approved and service provider created' });
  } catch (error) {
    console.error('❌ Approval error:', error);
    res.status(400).json({ success: false, error: error.message });
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
