import { Router } from 'express';
import {
  createAccountDemand,
  getAllAccountDemands,
  approveAccountDemand,
  rejectAccountDemand
} from '../controllers/accountDemandController.js';

const router = Router();
// routes/accountDemand.js or wherever your routes are
router.get('/all-demands', async (req, res) => {
  try {
    const demands = await AccountDemand.find();
    res.status(200).json({ success: true, data: demands });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


router.post('/service-signup', createAccountDemand);


router.post('/', createAccountDemand);
router.get('/', getAllAccountDemands);
router.post('/:id/approve', approveAccountDemand);
router.post('/:id/reject', rejectAccountDemand);

export default router;
