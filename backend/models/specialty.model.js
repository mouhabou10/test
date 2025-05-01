import mongoose from 'mongoose';

const specialitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Speciality name is required'],
      trim: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

const Speciality = mongoose.model('Speciality', specialitySchema);
export default Speciality;
