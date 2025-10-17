const PharmacyShopModel = require("../Model/PharmacyShopModel");

//Display Data
const getAllDetails = async (req, res, next) => {
  let pharmacyShop;
  try {
    pharmacyShop = await PharmacyShopModel.find();
  } catch (err) {
    console.log(err);
  }
  if (!pharmacyShop) {
    return res.status(404).json({ message: "Data not found" });
  }
  return res.status(200).json({ pharmacyShop });
};

//Insert Data
const addData = async (req, res, next) => {
  const { pharmacyName, location, pharmacyID, details } = req.body;

  let pharmacyShop;

  try {
    pharmacyShop = new PharmacyShopModel({
      pharmacyName,
      location,
      pharmacyID,
      details,
    });
    await pharmacyShop.save();
  } catch (err) {
    console.log(err);
  }
  if (!pharmacyShop) {
    return res.status(404).json({ message: "unable to add data" });
  }
  return res.status(200).json({ pharmacyShop });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let pharmacyShop;
  try {
    pharmacyShop = await PharmacyShopModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!pharmacyShop) {
    return res.status(404).json({ message: "Data Not Found" });
  }
  return res.status(200).json({ pharmacyShop });
};

//Update Details
const updateData = async (req, res, next) => {
  const id = req.params.id;
  const { pharmacyName, location, pharmacyID, details } = req.body;

  let pharmacyShop;

  try {
    pharmacyShop = await PharmacyShopModel.findByIdAndUpdate(id, {
      pharmacyName: pharmacyName,
      location: location,
      pharmacyID: pharmacyID,
      details: details,
    });
    pharmacyShop = await pharmacyShop.save();
  } catch (err) {
    console.log(err);
  }
  if (!pharmacyShop) {
    return res.status(404).json({ message: "Unable to Update data" });
  }
  return res.status(200).json({ pharmacyShop });
};

//Delete data
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let pharmacyShop;

  try {
    pharmacyShop = await PharmacyShopModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!pharmacyShop) {
    return res.status(404).json({ message: "Unable to Delete Details" });
  }
  return res.status(200).json({ pharmacyShop });
};

exports.getAllDetails = getAllDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;
