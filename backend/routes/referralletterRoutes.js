import { Router } from 'express';
import {
  createReferralLetter,
  getAllReferralLetters,
  getReferralLetterById,
 
  deleteReferralLetter
} from '../controllers/referralLetterController.js';

const referralLetterRouter = Router();

referralLetterRouter.post('/', createReferralLetter);
referralLetterRouter.get('/', getAllReferralLetters);
referralLetterRouter.get('/:id', getReferralLetterById);

referralLetterRouter.delete('/:id', deleteReferralLetter);

export default referralLetterRouter;
