import express from 'express';
const router = express.Router();

import {
  createServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  deleteServiceProvider,
  getWorkersByServiceProvider,
  searchServiceProviders,
  getWorkersForProvider ,
  syncWorkersToServiceProvider // Import the function
} from '../controllers/serviceProviderController.js';

// Route to sync workers for a specific service provider
router.post('/:id/sync-workers', async (req, res, next) => {
  try {
    const workers = await getWorkersForProvider(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Workers synced successfully',
      count: workers.length,
      data: workers
    });
  } catch (error) {
    next(error);
  }
});
import { getServiceProviderSpecialities } from '../controllers/serviceProviderController.js';
import { assignSpecialityToServiceProvider } from '../controllers/serviceProviderController.js';

router.post('/:id/assign-speciality', assignSpecialityToServiceProvider);
router.get('/:id/specialities', getServiceProviderSpecialities);
// Your other routes here...
router.post('/service-providers', createServiceProvider);
router.get('/service-providers', getAllServiceProviders);
router.get('/service-providers/:id', getServiceProviderById);
router.delete('/service-providers/:id', deleteServiceProvider);
router.get('/service-providers/:id/workers', getWorkersByServiceProvider);
router.get('/search/service-providers', searchServiceProviders);

export default router;
