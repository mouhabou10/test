// controllers/appointmentController.js
import mongoose from 'mongoose';
import Appointment from '../models/appointment.model.js';


// Create a new appointment
export const createAppointment = async (req, res, next) => {
  try {
    const { serviceProviderId, appointmentType, notes, documentId } = req.body;
    
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
    
    // Get client ID from user if authenticated
    let clientId;
    if (req.user && req.user.client) {
      clientId = req.user.client;
    } else if (req.body.clientId) {
      // Allow client ID to be passed in the request body
      clientId = req.body.clientId;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required'
      });
    }
    
    // Create appointment data object
    const appointmentData = {
      serviceProviderId,
      clientId,
      appointmentType,
      notes,
      status: 'pending',
      appointmentDate: new Date()
    };
    
    // Add document reference if provided
    if (documentId) {
      appointmentData.document = documentId;
    }
    
    // Create the appointment
    const newAppointment = await Appointment.create(appointmentData);
    
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
      serviceProviderId: serviceProviderId , // Default provider ID
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

// Get appointments for a client with optional status filter (only operation, labo, radio types)
export const getPendingAppointmentsForClient = async (req, res, next) => {
  try {
    // Get client ID from request parameters and status from query params
    const { clientId } = req.params;
    const { status, populate } = req.query; // Get status and populate from query params
    
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
    
    // Build the query object
    const query = {
      clientId: clientIdQuery,
      appointmentType: { $in: ['operation', 'labo', 'radio'] }
    };
    
    // Add status filter if provided, otherwise default to 'pending'
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'pending'; // Default to pending if no status provided
    }
    // If status is 'all', don't filter by status
    
    // Create a base query
    let appointmentsQuery = Appointment.find(query);
    
    // Apply population based on the populate parameter
    if (populate === 'true') {
      appointmentsQuery = appointmentsQuery
        .populate('serviceProviderId', 'name type email speciality')
        .populate('document')
        .populate('clientId', 'fullName email phoneNumber');
    } else {
      // Basic population for backward compatibility
      appointmentsQuery = appointmentsQuery
        .populate('serviceProviderId', 'name type email');
    }
    
    // Execute the query
    const appointments = await appointmentsQuery;
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching pending appointments:', error);
    next(error);
  }
};

// Get all radio appointments
export const getRadioAppointments = async (req, res, next) => {
  try {
    // Find all appointments with type 'radio'
    const radioAppointments = await Appointment.find({ appointmentType: 'radio' })
      .populate('serviceProviderId', 'name type email')
      .populate('clientId', 'name email')
      .populate('document');
    
    res.status(200).json({
      success: true,
      count: radioAppointments.length,
      data: radioAppointments
    });
  } catch (error) {
    console.error('Error fetching radio appointments:', error);
    next(error);
  }
};

// Get all appointments for a client (operation, labo, radio types)
export const getAllAppointmentsForClient = async (req, res, next) => {
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
    
    // Determine which client ID to use
    let clientIdToUse;
    
    // If user is authenticated, check if they're requesting their own appointments
    if (req.user && req.user.client) {
      // Use the authenticated user's client ID
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
    
    // Find all appointments for the specified client
    // Only include operation, labo, and radio appointments (exclude consultation)
    const appointments = await Appointment.find({
      clientId: clientIdQuery,
      appointmentType: { $in: ['operation', 'labo', 'radio'] }
    }).populate('serviceProviderId', 'name type email');
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    next(error);
  }
};
// Update only the appointment date
export const updateAppointmentDate = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { newDate } = req.body;

    if (!newDate || isNaN(new Date(newDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'A valid new appointment date is required'
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { appointmentDate: new Date(newDate) },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment date updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment date:', error);
    next(error);
  }
};

// Update appointment status when service provider uploads document
// Update appointment status and optionally appointment date
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { status, documentId, notes, appointmentDate } = req.body;

    // Validate appointment ID
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required'
      });
    }

    // Validate status
    if (!status || !['accepted', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (accepted or cancelled) is required'
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Authorization check: only the associated service provider or admin can update
    if (req.user && req.user.role !== 'admin') {
      if (!req.user.serviceProvider ||
          appointment.serviceProviderId.toString() !== req.user.serviceProvider.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this appointment'
        });
      }
    }

    // Prepare update data
    const updateData = { status };

    // Optional fields
    if (documentId) {
      updateData.document = documentId;
    }
    if (notes) {
      updateData.notes = notes;
    }

    // Optional: appointment date update
    if (appointmentDate) {
      const newDate = new Date(appointmentDate);
      if (isNaN(newDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid appointment date format'
        });
      }
      updateData.appointmentDate = newDate;
    }

    // Perform update
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true, runValidators: true }
    ).populate('serviceProviderId', 'name type email');

    res.status(200).json({
      success: true,
      message: `Appointment updated successfully`,
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    next(error);
  }
};

