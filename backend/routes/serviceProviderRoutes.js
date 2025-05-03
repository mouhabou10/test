import { Router } from 'express';
import {
  createServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  updateServiceProvider,
  deleteServiceProvider
} from '../controllers/ServiceProviderController.js';

const serviceProviderRouter = Router();

serviceProviderRouter.post('/', createServiceProvider);
serviceProviderRouter.get('/', getAllServiceProviders);
serviceProviderRouter.get('/:id', getServiceProviderById);
serviceProviderRouter.put('/:id', updateServiceProvider);
serviceProviderRouter.delete('/:id', deleteServiceProvider);

export default serviceProviderRouter;
