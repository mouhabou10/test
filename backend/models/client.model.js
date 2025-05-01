import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    clientNumber: {
      type: String,
      required: [true, 'Client number is required'],
      unique: true,
      trim: true
    }
    // Add client-specific fields if needed
  },
  {
    timestamps: true
  }
);

const Client = mongoose.model('Client', clientSchema);
export default Client;
