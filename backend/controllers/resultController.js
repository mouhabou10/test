import Result from '../models/Result.js';

// ─── CREATE RESULT ────────────────────────────────────────────────────────
export const createResult = async (req, res, next) => {
  try {
    const { id, testId, patientId, outcome, date } = req.body;
    const result = await Result.create({ id, testId, patientId, outcome, date });
    res.status(201).json({ success: true, message: 'Result created', data: result });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL RESULTS ──────────────────────────────────────────────────────
export const getAllResults = async (req, res, next) => {
  try {
    const results = await Result.find();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// ─── GET RESULT BY ID ─────────────────────────────────────────────────────
export const getResultById = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) throw new Error('Result not found');
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE RESULT ────────────────────────────────────────────────────────
export const deleteResult = async (req, res, next) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Result deleted' });
  } catch (error) {
    next(error);
  }
};
