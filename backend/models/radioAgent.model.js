import mongoose from 'mongoose';

const radioAgentSchema = new mongoose.Schema(
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

const RadioAgent = mongoose.model('RadioAgent', radioAgentSchema);
export default RadioAgent;
