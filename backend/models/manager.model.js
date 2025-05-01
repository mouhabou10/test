import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema(
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

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
