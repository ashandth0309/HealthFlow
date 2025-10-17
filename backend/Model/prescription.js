const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicationSchema = new Schema({
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    notes: String
});

const prescriptionSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    patientEmail: {
        type: String,
        required: true
    },
    rx: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    medications: [medicationSchema]
}, {
    timestamps: true
});

const PrescriptionModel = mongoose.model('Prescription', prescriptionSchema);
module.exports = PrescriptionModel;