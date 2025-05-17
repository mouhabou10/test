import Worker from '../models/worker.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

// CREATE WORKER
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
      speciality,       // Expecting a string (name)
      serviceProvider   // Expecting a valid ObjectId string
    } = req.body;

    // Create User
    const newUser = await User.create([{
      userId: Math.floor(Math.random() * 1000000),
      fullName,
      email,
      phoneNumber,
      password,
      role
    }], { session });

    // Create Worker
    const newWorker = await Worker.create([{
      user: newUser[0]._id,
      jobId,
      speciality,       // This should match your schema type (see below)
      serviceProvider
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Worker and user created successfully',
      data: {
        user: newUser[0],
        worker: newWorker[0]
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// GET ALL WORKERS
export const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find()
      .populate('serviceProvider', 'name')
      .populate('speciality', 'name');

    res.status(200).json({ success: true, data: workers });
  } catch (error) {
    next(error);
  }
};

// GET WORKER BY ID
export const getWorkerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id); // Use findById for ObjectId

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

// UPDATE WORKER
export const updateWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedWorker = await Worker.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedWorker) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: 'Worker updated successfully', data: updatedWorker });
  } catch (error) {
    next(error);
  }
};
