import { Router } from 'express';
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
} from '../controllers/PrescriptionController.js';

const prescriptionRouter = Router();

prescriptionRouter.post('/', createPrescription);
prescriptionRouter.get('/', getAllPrescriptions);
prescriptionRouter.get('/:id', getPrescriptionById);
prescriptionRouter.put('/:id', updatePrescription);
prescriptionRouter.delete('/:id', deletePrescription);

export default prescriptionRouter;
