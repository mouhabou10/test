import Worker from '../models/Worker.js';

export const createWorker = async (req, res, next) => {
  try {
    const worker = await Worker.create(req.body);
    res.status(201).json({ success: true, data: worker });
  } catch (error) {
    next(error);
  }
};

export const getWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find();
    res.status(200).json({ success: true, data: workers });
  } catch (error) {
    next(error);
  }
};
