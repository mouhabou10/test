
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true
    },
    path: {
      type: String,
      required: [true, 'File path is required'],
    },
    type: {
      type: String,
      required: [true, 'Document type is required'],
      enum: ['Ordonnance', 'Lettre d\'orientation', 'Résultat', 'radio prescription', 'labo prescription', 'referral letter', 'operation prescription']
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
