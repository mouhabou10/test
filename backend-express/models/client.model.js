import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    clientNumber: {
      type: String,
      required: [true, 'Client number is required'],
      unique: true,
      trim: true
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
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^0[5-7]\d{8}$/, 'Please provide a valid Algerian phone number']
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      trim: true
    },
    age: {
      type: Number,
      min: 0,
      max: 120
    }
  },
  {
    timestamps: true
  }
);

// Add a pre-save hook to generate client number if not provided
clientSchema.pre('save', async function(next) {
  if (!this.clientNumber) {
    try {
      // Find the highest client number
      const highestClient = await this.constructor.findOne({}, { clientNumber: 1 })
        .sort({ clientNumber: -1 });
      
      // Generate next number
      const nextNumber = highestClient 
        ? parseInt(highestClient.clientNumber.replace('CLT', '')) + 1 
        : 1;
      
      // Format with leading zeros
      this.clientNumber = `CLT${nextNumber.toString().padStart(6, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Client = mongoose.model('Client', clientSchema);
export default Client;
