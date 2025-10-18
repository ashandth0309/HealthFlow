const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LabResultSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabOrder',
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  results: {
    type: Array,
    required: true,
    default: []
  },
  criticalValues: {
    type: Array,
    default: []
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Reviewed'],
    default: 'Pending'
  },
  dateCompleted: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: String,
  },
  reviewDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("LabResult", LabResultSchema);