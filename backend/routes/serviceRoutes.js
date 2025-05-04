import { Router } from 'express';
import {
  createSpeciality,
  getAllSpecialities,
  getSpecialityById,
  deleteSpeciality
} from '../controllers/serviceController.js';

const SpecialityRouter = Router();

SpecialityRouter.post('/', createSpeciality);
SpecialityRouter.get('/', getAllSpecialities);
SpecialityRouter.get('/:id', getSpecialityById);
SpecialityRouter.delete('/:id', deleteSpeciality);

export default SpecialityRouter;
