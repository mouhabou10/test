// controllers/WorkerController.js

import Worker from '../models/worker.model.js';
import mongoose from 'mongoose';

// ─── CREATE WORKER ──────────────────────────────────────────────────────
export const createWorker = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id, name, job, service } = req.body;

    const [newWorker] = await Worker.create([
      { id, name, job, service }
    ], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Worker created successfully',
      data: newWorker,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// ─── GET ALL WORKERS ────────────────────────────────────────────────────
export const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find();
    res.status(200).json({
      success: true,
      data: workers,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE WORKER ──────────────────────────────────────────────────
export const getWorkerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findOne({ id });

    if (!worker) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: worker,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE WORKER ──────────────────────────────────────────────────────
export const deleteWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Worker.findOneAndDelete({ id });

    if (!deleted) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Worker deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE WORKER ──────────────────────────────────────────────────────
export const updateWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedWorker = await Worker.findOneAndUpdate(
      { id },
      updatedData,
      { new: true }
    );

    if (!updatedWorker) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Worker updated successfully',
      data: updatedWorker,
    });
  } catch (error) {
    next(error);
  }
};
