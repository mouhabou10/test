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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    confirmPassword: {
      type: String,
      // Only required during document creation
      required: function () {
        return this.isNew;
      },
      validate: {
        validator: function (el) {
          // Only validate if confirmPassword is provided
          return !el || el === this.password;
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
      trim: true
    },

    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['hospital', 'cabine', 'clinic']
    },

    // When type is 'cabine', use a single string value
    speciality: {
      type: String,
      required: function () {
        return this.type === 'cabine';
      }
    },

    // When type is 'hospital' or 'clinic', use multiple references
    specialities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Speciality',
        required: function () {
          return this.type !== 'cabine';
        }
      }
    ],
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
     // or false, depending on your app logic
    },
    workers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
      }
    ],

    status: {
      type: String,
      enum: ['approved'],
      default: 'approved'
    },

    ticketCounter: {
      type: Number,
      default: 0
    },
    waitingCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
serviceProviderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
export default ServiceProvider;
