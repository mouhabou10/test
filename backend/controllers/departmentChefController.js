import DepartementChef from '../models/DepartementChef.js';
import User from '../models/User.js';

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
