import bcrypt from 'bcryptjs';
import Worker from '../models/worker.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

// CREATE WORKER with hashed password
export const createWorker = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      jobId,
      fullName,
      email,
      phoneNumber,
      password,
      role,
      speciality, // expected to be a string
      serviceProvider
    } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create([{
      userId: Math.floor(Math.random() * 1000000),
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role
    }], { session });

    // Create Worker with string speciality
    const newWorker = await Worker.create([{
      user: newUser[0]._id,
      jobId,
      speciality, // save as string
      serviceProvider
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Worker and user created successfully',
      data: {
        user: {
          _id: newUser[0]._id,
          fullName: newUser[0].fullName,
          email: newUser[0].email,
          role: newUser[0].role
        },
        worker: {
          _id: newWorker[0]._id,
          jobId: newWorker[0].jobId,
          speciality: newWorker[0].speciality,
          serviceProvider: newWorker[0].serviceProvider
        }
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// GET ALL WORKERS
// GET ALL WORKERS
export const getAllWorkers = async (req, res, next) => {
  try {
    // Add serviceProvider filter from query params
    const { serviceProvider } = req.query;
    const filter = serviceProvider ? { serviceProvider } : {};

    const workers = await Worker.find(filter)
      .populate('user', 'fullName email phoneNumber role')
      .populate('serviceProvider', 'name');

    res.status(200).json({ success: true, data: workers });
  } catch (error) {
    next(error);
  }
};

// GET WORKER BY ID
export const getWorkerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id);

    if (!worker) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: worker });
  } catch (error) {
    next(error);
  }
};

// DELETE WORKER
export const deleteWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Worker.findByIdAndDelete(id);

    if (!deleted) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: 'Worker deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// UPDATE WORKER with password hashing if password provided
export const updateWorker = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // Hash password if provided
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    // Update Worker fields (jobId, speciality, serviceProvider)
    const updatedWorker = await Worker.findByIdAndUpdate(id, updatedData, { new: true, session });

    if (!updatedWorker) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    // Prepare user fields to update
    const userFields = {};
    ['fullName', 'email', 'phoneNumber', 'role', 'password'].forEach(field => {
      if (updatedData[field] !== undefined) {
        userFields[field] = updatedData[field];
      }
    });

    // Update User document with any user fields
    if (Object.keys(userFields).length > 0) {
      await User.findByIdAndUpdate(updatedWorker.user, userFields, { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Worker updated successfully',
      data: updatedWorker
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
