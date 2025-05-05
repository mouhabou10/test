import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';


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

    const [newUser] = await User.create(
      [{
        userId,
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        role
      }],
      { session }
    );

    const token = jwt.sign(
      { userId: newUser._id },
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

// ─── SIGN IN ─────────────────────────────────────────────────────────────
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Incorrect password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user,
      },
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
