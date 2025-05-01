import mongoose from 'mongoose';

const laboAgentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    jobId: {
      type: String,
      required: [true, 'Job ID is required'],
      unique: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const LaboAgent = mongoose.model('LaboAgent', laboAgentSchema);
export default LaboAgent;
