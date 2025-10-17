const mongoose = require('mongoose');

const admitSchema = new mongoose.Schema({
  admitID: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  },
  nic: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  assignedDoctor: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Pending Admission"
  },
  roomId: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  },
  appointmentData: {
    type: Object,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admit', admitSchema);