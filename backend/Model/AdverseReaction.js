const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdverseReactionSchema = new Schema({
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
  reactionType: {
    type: String,
    required: true,
    enum: [
      'Allergic Reaction to Antiseptic',
      'Contrast Media Reaction', 
      'Local Anesthetic Reaction',
      'Hypoglycemic Episode',
      'Equipment Malfunction Injury',
      'Specimen Collection Complication',
      'Other'
    ]
  },
  severity: {
    type: String,
    required: true,
    enum: ['Mild', 'Moderate', 'Severe']
  },
  description: {
    type: String,
    required: true,
  },
  reportedBy: {
    type: String,
    required: true,
  },
  dateReported: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Under Review', 'Investigated', 'Resolved', 'Monitored'],
    default: 'Under Review'
  },
  actionTaken: {
    type: String,
    default: ''
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
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

module.exports = mongoose.model("AdverseReaction", AdverseReactionSchema);