// controllers/appointmentController.js
import mongoose from 'mongoose';

// We'll create a simple appointment schema for now
// In a real application, you would have a proper model file
const appointmentSchema = new mongoose.Schema(
  {
    serviceProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Service provider ID is required'],
      ref: 'ServiceProvider'
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      default: '6452a7d1f5b6a9c8e3d2b1a0' // Default client ID for testing
    },
    appointmentType: {
      type: String,
      required: [true, 'Appointment type is required'],
      enum: ['consultation', 'radio', 'labo', 'operation']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    notes: String,
    appointmentDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Create the Appointment model if it doesn't exist
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

// Create a new appointment
export const createAppointment = async (req, res, next) => {
  try {
    const { serviceProviderId, appointmentType, notes } = req.body;
    
    // Validate required fields
    if (!serviceProviderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Service provider ID is required' 
      });
    }
    
    if (!appointmentType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Appointment type is required' 
      });
    }
    
    // Get client ID from user if authenticated, or use default
    let clientId = '6452a7d1f5b6a9c8e3d2b1a0'; // Default for testing
    if (req.user && req.user.client) {
      clientId = req.user.client;
    }
    
    // Create the appointment
    const newAppointment = await Appointment.create({
      serviceProviderId,
      clientId,
      appointmentType,
      notes,
      status: 'pending',
      appointmentDate: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: newAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    next(error);
  }
};

// Get all appointments
export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// Get all pending appointments (for testing)
export const getAllPendingAppointments = async (req, res, next) => {
  try {
    const pendingAppointments = await Appointment.find({ status: 'pending' })
      .populate('serviceProviderId', 'name type email');
    
    res.status(200).json({
      success: true,
      count: pendingAppointments.length,
      data: pendingAppointments
    });
  } catch (error) {
    console.error('Error fetching all pending appointments:', error);
    next(error);
  }
};

// Create a test appointment with the specified client ID (for testing)
export const createTestAppointment = async (req, res, next) => {
  try {
    const { clientId, appointmentType, serviceProviderId } = req.body;
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required'
      });
    }
    
    // Create a test appointment with pending status
    const appointmentData = {
      clientId,
      serviceProviderId: serviceProviderId || '68287dd360af7babbb0f06ac', // Default provider ID
      appointmentType: appointmentType || 'consultation',
      status: 'pending',
      notes: 'Test appointment created for debugging',
      appointmentDate: new Date()
    };
    
    // Test appointment created successfully
    
    res.status(201).json({
      success: true,
      message: 'Test appointment created successfully',
      data: newAppointment
    });
  } catch (error) {
    next(error);
  }
};

// Get pending appointments for a client (only operation, labo, radio types)
export const getPendingAppointmentsForClient = async (req, res, next) => {
  try {
    // Get client ID from request parameters
    const { clientId } = req.params;
    
    // Validate client ID
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required'
      });
    }
    
    // Check if the client ID belongs to the authenticated user
    // This ensures we only return appointments for the current client
    let clientIdToUse;
    
    // If user is authenticated and has a client ID
    if (req.user && req.user.client) {
      // If the requested clientId doesn't match the authenticated user's client ID
      // and the user is not an admin, return an error
      if (clientId !== req.user.client.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view appointments for this client'
        });
      }
      clientIdToUse = req.user.client;
    } else {
      // If no user authentication, just use the provided client ID
      clientIdToUse = clientId;
    }
    
    // Try to convert clientId to ObjectId if it's a valid ObjectId string
    let clientIdQuery;
    try {
      if (mongoose.Types.ObjectId.isValid(clientIdToUse)) {
        clientIdQuery = clientIdToUse; // MongoDB will handle the conversion
      } else {
        // If it's not a valid ObjectId, use the string as is
        clientIdQuery = clientIdToUse;
      }
    } catch (err) {
      clientIdQuery = clientIdToUse; // Fallback to using the string
    }
    
    // No debug code needed
    
    // Find appointments with pending status for the specified client
    // Only include operation, labo, and radio appointments (exclude consultation)
    const pendingAppointments = await Appointment.find({
      clientId: clientIdQuery,
      status: 'pending',
      appointmentType: { $in: ['operation', 'labo', 'radio'] }
    }).populate('serviceProviderId', 'name type email');
    
    // Appointments filtered successfully
    
    res.status(200).json({
      success: true,
      count: pendingAppointments.length,
      data: pendingAppointments
    });
  } catch (error) {
    console.error('Error fetching pending appointments:', error);
    next(error);
  }
};
