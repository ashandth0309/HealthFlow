const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescription = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    rx: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    patientEmail: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});
const prescriptionSchema = mongoose.model('prescription', prescription);
module.exports = prescriptionSchema;