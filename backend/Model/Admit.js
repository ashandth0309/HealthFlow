const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdmitSchema = new Schema({
  hospital: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
  },
  birth: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  guardian: {
    type: String,
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  admitID: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,  
  },
  medications: {
    type: String,
    required: true, 
  },
  status: {
    type: String,
  },
  past: {
    type: String,
    required: true, 
  },
  symptoms: {
    type: String,
    required: true, 
  },
  prescription: {
    type: String,
    required: true, 
  },
  discharge: {
    type: String,
  },
});

module.exports = mongoose.model("Admit", AdmitSchema);
