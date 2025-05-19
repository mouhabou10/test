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
      enum: ['consultation', 'radio', 'lab']
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
