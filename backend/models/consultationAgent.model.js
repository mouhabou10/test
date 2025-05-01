import mongoose from 'mongoose';

const consultationAgentSchema = new mongoose.Schema(
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
    // Add consultation-agent-specific fields if needed
  },
  {
    timestamps: true
  }
);

const ConsultationAgent = mongoose.model('ConsultationAgent', consultationAgentSchema);
export default ConsultationAgent;
