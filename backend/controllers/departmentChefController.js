import DepartementChef from '../models/departmentChef.model.js';
import User from '../models/user.model.js';
import ReferralLetter from '../models/referralLetter.model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload referral letter
export const uploadReferralLetter = async (req, res, next) => {
  try {
    const { patientId, department } = req.body;
    const file = req.file;

    if (!file) throw new Error('No file uploaded');

    const referral = await ReferralLetter.create({
      patient: patientId,
      department,
      filePath: file.path,
    });

    res.status(201).json({
      success: true,
      message: 'Referral letter uploaded successfully',
      data: referral,
    });
  } catch (error) {
    next(error);
  }
};

// Download referral letter
export const downloadReferralLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const referral = await ReferralLetter.findById(id);
    if (!referral) throw new Error('Referral letter not found');

    const filePath = path.join(__dirname, '..', referral.filePath);
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};

// Get all referral letters
export const getAllReferralLetters = async (req, res, next) => {
  try {
    const letters = await ReferralLetter.find().populate('patient');
    res.status(200).json({ success: true, data: letters });
  } catch (error) {
    next(error);
  }
};

// ─── CREATE DEPARTEMENT CHEF ─────────────────────────────────────────────
export const createDepartementChef = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const newChef = await DepartementChef.create({ user: userId });

    res.status(201).json({
      success: true,
      message: 'Departement Chef created successfully',
      data: newChef,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL DEPARTEMENT CHEFS ───────────────────────────────────────────
export const getDepartementChefs = async (req, res, next) => {
  try {
    const chefs = await DepartementChef.find().populate('user');
    res.status(200).json({
      success: true,
      data: chefs,
    });
  } catch (error) {
    next(error);
  }
};
