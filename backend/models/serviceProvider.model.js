import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service provider name is required'],
      trim: true
    },
    speciality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Speciality',
      required: true
    },
    workers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
      }
    ]
  },
  {
    timestamps: true
  }
);

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
export default ServiceProvider;
