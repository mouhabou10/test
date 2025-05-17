import AccountDemand from '../models/accountDemand.model.js';
import ServiceProvider from '../models/serviceProvider.model.js';
import bcrypt from 'bcryptjs';

// ─── CREATE ACCOUNT DEMAND ────────────────────────────────────────────────
export const createAccountDemand = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      wilaya,
      type,
      speciality,
      password,
      confirmPassword
    } = req.body;

    if (type === 'cabine' && !speciality) {
      return res.status(400).json({
        success: false,
        message: 'Speciality is required for service providers of type "cabine"'
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
      confirmPassword
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

// ─── GET ALL DEMANDS (FOR ADMIN) ──────────────────────────────────────────
export const getAllAccountDemands = async (req, res, next) => {
  try {
    const demands = await AccountDemand.find();
    res.status(200).json({
      success: true,
      data: demands
    });
  } catch (error) {
    next(error);
  }
};

// ─── APPROVE DEMAND AND CREATE SERVICE PROVIDER ───────────────────────────
export const approveAccountDemand = async (req, res, next) => {
  try {
    const demand = await AccountDemand.findById(req.params.id);
    if (!demand || demand.status !== 'pending') {
      return res.status(404).json({
        success: false,
        message: 'Demand not found or already processed'
      });
    }

    const hashedPassword = await bcrypt.hash(demand.password, 12);

    const serviceProvider = await ServiceProvider.create({
      name: demand.fullName,
      email: demand.email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      wilaya: demand.wilaya,
      directorId: 'ADMIN', // Replace this with actual admin ID if needed
      type: demand.type,
      speciality: demand.speciality || undefined
    });

    demand.status = 'approved';
    await demand.save();

    res.status(201).json({
      success: true,
      message: 'Account approved and service provider created successfully',
      data: serviceProvider
    });
  } catch (error) {
    next(error);
  }
};

// ─── REJECT DEMAND ────────────────────────────────────────────────────────
export const rejectAccountDemand = async (req, res, next) => {
  try {
    const demand = await AccountDemand.findById(req.params.id);
    if (!demand || demand.status !== 'pending') {
      return res.status(404).json({
        success: false,
        message: 'Demand not found or already processed'
      });
    }

    demand.status = 'rejected';
    await demand.save();

    res.status(200).json({
      success: true,
      message: 'Account demand rejected'
    });
  } catch (error) {
    next(error);
  }
};
