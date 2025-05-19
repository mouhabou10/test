// routes/appointmentRoutes.js
import { Router } from 'express';
import { createAppointment, getAllAppointments } from '../controllers/appointmentController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const appointmentRouter = Router();

// Create a new appointment - making auth optional for testing
appointmentRouter.post('/', createAppointment);

// Get all appointments
appointmentRouter.get('/', getAllAppointments);

export default appointmentRouter;
