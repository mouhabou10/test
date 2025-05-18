import { Router } from 'express';
import {
  createServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  searchServiceProviders,
  deleteServiceProvider
} from '../controllers/serviceProviderController.js';

const serviceProviderRouter = Router();

serviceProviderRouter.post('/service-signup', createServiceProvider);
serviceProviderRouter.get('/', getAllServiceProviders);

// Place the search route BEFORE the :id route
serviceProviderRouter.get('/search', searchServiceProviders);

// ID-specific routes should come after specific routes
serviceProviderRouter.get('/:id', getServiceProviderById);
serviceProviderRouter.delete('/:id', deleteServiceProvider);

export default serviceProviderRouter;