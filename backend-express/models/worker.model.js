import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  jobId: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  speciality: { 
    type: String,              // Changed from ObjectId to String (speciality name)
    required: true 
  },
  serviceProvider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ServiceProvider', 
    required: true 
  }
}, {
  timestamps: true
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
