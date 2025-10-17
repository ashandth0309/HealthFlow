const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClinicSchema = new Schema({
  clinicname: {
    type: String,
    required: true,
  },
  clinicID: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Clinic", ClinicSchema);
