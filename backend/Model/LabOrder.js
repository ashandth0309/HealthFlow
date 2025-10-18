const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LabOrderSchema = new Schema({
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  testType: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedResults: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Normal', 'High', 'Low'],
    default: 'Normal'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  analyzer: {
    type: String,
    required: true,
  },
  results: {
    type: Array,
    default: []
  },
  criticalValues: {
    type: Array,
    default: []
  },
  notes: {
    type: String,
  },
  completedDate: {
    type: Date,
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

module.exports = mongoose.model("LabOrder", LabOrderSchema);