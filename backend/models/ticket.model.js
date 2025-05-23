import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: true
    },
    number: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['not passed yet', 'passed', 'cancelled'],
      default: 'not passed yet'
    },
    speciality: {
      type: String,
      required: true
    },
    ticketType: {
      type: String,
      enum: ['consultation', 'radio', 'labo'],
      required: true
    },
    total: {
      type: Number,
      default: 0
    },
    waitingList: {
      type: Number,
      default: 0
    },
    clientTurn: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);


const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
