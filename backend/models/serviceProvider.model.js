import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const serviceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service provider name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords do not match'
      }
    },
    wilaya: {
      type: String,
      required: [true, 'Wilaya is required']
    },
    directorId: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 18,
      trim: true,
    },
    
    
    speciality: { type:String, required: true },
    workers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Hash password before saving
serviceProviderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; // Remove from DB
  next();
});

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
export default ServiceProvider;
