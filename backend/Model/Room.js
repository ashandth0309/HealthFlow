const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['ward', 'private', 'icu'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'cleaning', 'maintenance'],
    default: 'available'
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admit',
    default: null
  },
  floor: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);