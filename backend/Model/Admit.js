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
  },
  // New discharge fields
  dischargePlanning: {
    medicalSummary: { type: String, default: '' },
    medications: { type: String, default: '' },
    instructions: { type: String, default: '' },
    followUp: { type: String, default: '' }
  },
  dischargeSummary: {
    admissionDate: { type: Date },
    primaryDiagnosis: { type: String, default: '' },
    treatmentProvided: { type: String, default: '' },
    dischargeMedications: { type: String, default: '' }
  },
  dischargeInstructions: {
    activityRestrictions: { type: String, default: '' },
    dietInstructions: { type: String, default: '' },
    followUpAppointments: { type: String, default: '' },
    emergencyContact: { type: String, default: '(555) 123-4567' }
  },
  roomReleaseStatus: {
    type: String,
    default: 'Not Released'
  },
  dischargeDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admit', admitSchema);