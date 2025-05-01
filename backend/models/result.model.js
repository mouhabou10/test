import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true
    },
    fileUrl: {
      type: String,
      required: [true, 'Result file URL is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Result = mongoose.model('Result', resultSchema);
export default Result;
