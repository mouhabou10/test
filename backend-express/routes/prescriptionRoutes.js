import { Router } from 'express';
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  deletePrescription
} from '../controllers/PrescriptionController.js';

const prescriptionRouter = Router();

prescriptionRouter.post('/', createPrescription);
prescriptionRouter.get('/', getAllPrescriptions);
prescriptionRouter.get('/:id', getPrescriptionById);
prescriptionRouter.delete('/:id', deletePrescription);

export default prescriptionRouter;
