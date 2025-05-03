import { Router } from 'express';
import {
  createReferralLetter,
  getAllReferralLetters,
  getReferralLetterById,
  updateReferralLetter,
  deleteReferralLetter
} from '../controllers/ReferralLetterController.js';

const referralLetterRouter = Router();

referralLetterRouter.post('/', createReferralLetter);
referralLetterRouter.get('/', getAllReferralLetters);
referralLetterRouter.get('/:id', getReferralLetterById);
referralLetterRouter.put('/:id', updateReferralLetter);
referralLetterRouter.delete('/:id', deleteReferralLetter);

export default referralLetterRouter;
