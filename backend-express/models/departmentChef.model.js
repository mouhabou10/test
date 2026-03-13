import mongoose from 'mongoose';

const departmentChefSchema = new mongoose.Schema(
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

const DepartmentChef = mongoose.model('DepartmentChef', departmentChefSchema);
export default DepartmentChef;
