import mongoose from 'mongoose';
import Tiket from '../models/Tiket.js';

// ─── CREATE TIKET ───────────────────────────────────────────────────────
export const createTiket = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { number, service, serviceProvider, tiketType } = req.body;

    const [newTiket] = await Tiket.create([
      { number, service, serviceProvider, tiketType }
    ], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Tiket created successfully',
      data: newTiket,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// ─── GET ALL TIKETS ─────────────────────────────────────────────────────
export const getAllTikets = async (req, res, next) => {
  try {
    const tikets = await Tiket.find();
    res.status(200).json({ success: true, data: tikets });
  } catch (error) {
    next(error);
  }
};

// ─── RESET TIKETS LIST ──────────────────────────────────────────────────
export const resetTikets = async (req, res, next) => {
  try {
    await Tiket.deleteMany({});
    res.status(200).json({ success: true, message: 'All tikets have been reset' });
  } catch (error) {
    next(error);
  }
};

// ─── PAUSE A DEMAND ─────────────────────────────────────────────────────
export const pauseTiket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tiket = await Tiket.findByIdAndUpdate(id, { status: 'paused' }, { new: true });

    if (!tiket) {
      const error = new Error('Tiket not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: 'Tiket paused', data: tiket });
  } catch (error) {
    next(error);
  }
};
