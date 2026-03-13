// models/appointment.model.js
import mongoose from 'mongoose';

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
      required: [true, 'Client ID is required']
    },
    appointmentType: {
      type: String,
      required: [true, 'Appointment type is required'],
      enum: ['consultation', 'radio', 'labo', 'operation']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'cancelled', 'completed'],
      default: 'pending'
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      // Not required for consultation appointments
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

// Add a pre-save middleware to validate document requirement for non-consultation appointments
appointmentSchema.pre('save', function(next) {
  // Skip validation if this is a consultation appointment
  if (this.appointmentType === 'consultation') {
    return next();
  }
  
  // For radio, labo, and operation appointments, document is required
  if (!this.document) {
    return next(new Error(`Document is required for ${this.appointmentType} appointments`));
  }
  
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
