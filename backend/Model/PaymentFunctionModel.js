const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PaymentFunctionShopSchema = new Schema({
  paymentID: {
    type: String,
  },
  cardID: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  cardname: {
    type: String,
  },
  cardnumber: {
    type: String,
  },
  cardholdername: {
    type: String,
  },
  expdate: {
    type: String,
  },
  cvv: {
    type: String,
  },
  fullname: {
    type: String,
  },
  address: {
    type: String,
  },
  contactNo: {
    type: String,
  },
  email: {
    type: String,
  },
  amount: {
    type: String,
  },
});

module.exports = mongoose.model("PaymentFunction", PaymentFunctionShopSchema);
