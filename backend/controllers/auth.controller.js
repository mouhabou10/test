import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import Worker from '../models/worker.model.js'; // import Worker model
import ServiceProvider from '../models/serviceProvider.model.js'; // Add this import


// ─── SIGN UP ─────────────────────────────────────────────────────────────
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log('Request body:', req.body);
  console.log('Received body:', req.body);

  try {
    const {
      userId,
      fullName,
      email,
      phoneNumber,
      password,
      role
    } = req.body;

  // Basic validation
if (!userId || !fullName || !email || !phoneNumber || !password || !role) {
  return res.status(400).json({ success: false, error: 'All fields are required' });
}

const existingUser = await User.findOne({ email }).session(session);
if (existingUser) {
  const error = new Error('User already exists');
  error.statusCode = 409;
  throw error;
}

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Determine serviceProviderId if role is not client
let serviceProviderId = null;
if (role !== 'client') {
  serviceProviderId = userId; // Or generate a new unique value as needed
}

const [newUser] = await User.create(
  [{
    userId,
    fullName,
    email,
    phoneNumber,
    password: hashedPassword,
    role,
    serviceProviderId
  }],
  { session }
);

const token = jwt.sign(
  { userId: newUser._id, serviceProviderId: newUser.serviceProviderId },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: newUser,
      },
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
// backend/controllers/auth.controller.js


export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Prepare base response
    let responseUser = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      speciality: null,
      serviceProviderId: null
    };

    // If user is not a client, get their service provider info
    if (user.role !== 'client') {
      // First try to find worker record
      const worker = await Worker.findOne({ user: user._id })
        .populate('serviceProvider', 'name');
      
      if (worker && worker.serviceProvider) {
        responseUser.serviceProviderId = worker.serviceProvider._id;
        responseUser.speciality = worker.speciality || null;
      } else {
        // If no worker record, check for direct service provider link
        const serviceProvider = await ServiceProvider.findOne({ userId: user._id });
        if (serviceProvider) {
          responseUser.serviceProviderId = serviceProvider._id;
        }
      }
    }

    // Include serviceProviderId in token payload
    const token = jwt.sign(
      { 
        userId: user._id,
        serviceProviderId: responseUser.serviceProviderId 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: responseUser
      }
    });
  } catch (error) {
    next(error);
  }
};
// ─── SIGN OUT (Placeholder) ──────────────────────────────────────────────
export const signOut = (req, res, next) => {
  // For stateless JWT: usually handled on frontend or with token blacklist
  res.status(200).json({
    success: true,
    message: 'User signed out (client should delete token)',
  });
};
