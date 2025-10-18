const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BillingRecordSchema = new Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  services: {
    type: String,
    required: true,
  },
  serviceDetails: {
    type: Array,
    default: []
  },
  amount: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue', 'Cancelled', 'Refunded'],
    default: 'Pending'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Bank Transfer', 'Insurance', 'Other'],
  },
  paymentDate: {
    type: Date,
  },
  transactionId: {
    type: String,
  },
  labOrderIds: {
    type: Array,
    default: []
  },
  billedBy: {
    type: String,
    required: true,
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

// Auto-generate invoice ID before saving
BillingRecordSchema.pre('save', function(next) {
  if (!this.invoiceId) {
    this.invoiceId = 'INV-' + Date.now();
  }
  if (!this.totalAmount) {
    this.totalAmount = this.amount + (this.tax || 0);
  }
  next();
});

module.exports = mongoose.model("BillingRecord", BillingRecordSchema);