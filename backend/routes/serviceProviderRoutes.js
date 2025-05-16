import { Router } from 'express';
import {
  createServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
 
  deleteServiceProvider
} from '../controllers/ServiceProviderController.js';

const serviceProviderRouter = Router();

serviceProviderRouter.post('/service-signup', createServiceProvider);
serviceProviderRouter.get('/', getAllServiceProviders);
serviceProviderRouter.get('/:id', getServiceProviderById);

serviceProviderRouter.delete('/:id', deleteServiceProvider);

export default serviceProviderRouter;
