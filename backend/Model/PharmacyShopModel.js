const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PharmacyShopSchema = new Schema({
  pharmacyName: {
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
  pharmacyID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PharmacyShop", PharmacyShopSchema);
