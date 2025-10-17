const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DoctorAppoimentSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  doctorAppoimentID: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  doctorname: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("DoctorAppoiment", DoctorAppoimentSchema);
