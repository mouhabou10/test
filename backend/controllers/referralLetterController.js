import ReferralLetter from '../models/referralLetter.model.js';

// ─── CREATE REFERRAL LETTER ───────────────────────────────────────────────
export const createReferralLetter = async (req, res, next) => {
  try {
    const { id, senderId, receiverId, reason, date } = req.body;
    const referral = await ReferralLetter.create({ id, senderId, receiverId, reason, date });
    res.status(201).json({ success: true, message: 'Referral letter created', data: referral });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL REFERRAL LETTERS ─────────────────────────────────────────────
export const getAllReferralLetters = async (req, res, next) => {
  try {
    const referrals = await ReferralLetter.find();
    res.status(200).json({ success: true, data: referrals });
  } catch (error) {
    next(error);
  }
};

// ─── GET REFERRAL LETTER BY ID ────────────────────────────────────────────
export const getReferralLetterById = async (req, res, next) => {
  try {
    const referral = await ReferralLetter.findById(req.params.id);
    if (!referral) throw new Error('Referral letter not found');
    res.status(200).json({ success: true, data: referral });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE REFERRAL LETTER ───────────────────────────────────────────────
export const deleteReferralLetter = async (req, res, next) => {
  try {
    await ReferralLetter.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Referral letter deleted' });
  } catch (error) {
    next(error);
  }
};
