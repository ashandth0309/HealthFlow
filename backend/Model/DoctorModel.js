const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const doctorfunctionSchema = new Schema({
  doctorName: {
    type: String,
    required: true,
  },
  doctorID: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
  },
  clinic: {
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
  date: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("doctorfunction", doctorfunctionSchema);
