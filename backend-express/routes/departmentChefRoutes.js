
// routes/departmentChefRoutes.js
import express from 'express';
import {
  createDepartementChef,
  getDepartementChefs
} from '../controllers/departmentChefController.js';

import {

  getAllReferralLetters
} from '../controllers/referralLetterController.js';

import multer from 'multer';
const upload = multer({ dest: 'uploads/referrals/' });

const router = express.Router();

router.post('/', createDepartementChef);
router.get('/', getDepartementChefs);

// Referral Letters

router.get('/referral', getAllReferralLetters);

export default router;
