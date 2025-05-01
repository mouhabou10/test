import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^0[5-7]\d{8}$/, 'Please provide a valid Algerian phone number']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      required: true,
      enum: [
        'manager',
        'worker',
        'client',
        'chefDepartment',
        'laboAgent',
        'radioAgent',
        'consultation agent'
      ]
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
