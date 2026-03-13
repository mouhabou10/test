import express from 'express';
import {
  createAccountDemand,
  getAllAccountDemands,
  approveAccountDemand,
  rejectAccountDemand
} from '../controllers/accountDemandController.js';

const router = express.Router();

// Route to submit a new demand
router.post('/', createAccountDemand);

// Route to get all demands (admin use)
router.get('/', getAllAccountDemands);

// Route to approve a demand by ID
router.post('/approve/:id', approveAccountDemand);

// Route to reject a demand by ID
router.delete('/:id', rejectAccountDemand);

export default router;
