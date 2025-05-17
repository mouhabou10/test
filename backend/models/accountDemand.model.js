import mongoose from 'mongoose';

const accountDemandSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  wilaya: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['hospital', 'cabine', 'clinic']
  },
  speciality: {
    type: String,
    required: function () {
      return this.type === 'cabine';
    }
  },
  password: { type: String, required: true },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const AccountDemand = mongoose.model('AccountDemand', accountDemandSchema);
export default AccountDemand;
