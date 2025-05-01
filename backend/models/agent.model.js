import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema(
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
    // Add more agent-specific fields here if needed
  },
  {
    timestamps: true
  }
);

const Agent = mongoose.model('Agent', agentSchema);
export default Agent;
