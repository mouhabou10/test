import mongoose from 'mongoose';

const referralLetterSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    description: {
      type: String,
      required: [true, 'Referral description is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const ReferralLetter = mongoose.model('ReferralLetter', referralLetterSchema);
export default ReferralLetter;
