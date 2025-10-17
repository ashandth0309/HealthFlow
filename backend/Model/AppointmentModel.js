const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  appointmentID: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  clinic: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  timeSlotStart: {
    type: String,
    required: true,
  },
  timeSlotEnd: {
    type: String,
    required: true,
  },
  appointmentStatus: {
    type: String,
  },
  doctorID: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
