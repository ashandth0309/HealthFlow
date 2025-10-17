const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PharmacyOrderSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  patientID: {
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
  pharmacyname: {
    type: String,
    required: true,
  },
  deliveryMethod: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  prescriptionImg: {
    type: String, 
    required: true,
  },
  status: {
    type: String,
  },
  OrderID: {
    type: String,
    required: true,
  },
  pharmacyID: {
    type: String,
    required: true,
  },
  shipping: {
    type: String,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("PharmacyOrder", PharmacyOrderSchema);
