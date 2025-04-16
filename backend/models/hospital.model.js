import mongoose from 'mongoose';

const HospitalSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'The id is required'],
      unique: true,
      // `length` doesn't exist for numbers, consider using string for exact length
    },
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      minlength: 2,
      maxlength: 18,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      minlength: 5,
      maxlength: 50,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    phonenumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      minlength: 10,
      maxlength: 10,
      match: [/^0[5-7]\d{8}$/, 'Please provide a valid Algerian phone number']
    }
  },
  {
    timestamps: true
  }
);

const Hospital = mongoose.model('Hospital', HospitalSchema);
export default Hospital;
