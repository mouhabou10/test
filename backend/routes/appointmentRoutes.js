// routes/appointmentRoutes.js
import { Router } from 'express';
import { createAppointment, getAllAppointments, getPendingAppointmentsForClient, getAllPendingAppointments, createTestAppointment, getRadioAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const appointmentRouter = Router();

// Create a new appointment - making auth optional for testing
appointmentRouter.post('/', createAppointment);

// Get all appointments
appointmentRouter.get('/', getAllAppointments);

// Get all pending appointments (for testing)
appointmentRouter.get('/pending', getAllPendingAppointments);

// Create a test appointment (for testing)
appointmentRouter.post('/test', createTestAppointment);

// Get pending appointments for a specific client
appointmentRouter.get('/client/:clientId/pending', getPendingAppointmentsForClient);

// Get all radio appointments
appointmentRouter.get('/radio', getRadioAppointments);

// Update appointment status
appointmentRouter.put('/:appointmentId/status', updateAppointmentStatus);

export default appointmentRouter;
