const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  notes: { type: String, default: '' }
});

const prescriptionSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true }, // Doctor's email
  patientEmail: { type: String, required: true },
  rx: { type: String, required: true },
  date: { type: Date, default: Date.now },
  medications: [medicationSchema],
  doctorId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);