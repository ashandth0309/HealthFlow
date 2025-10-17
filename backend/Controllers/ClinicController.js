const ClinicModel = require("../Model/ClinicModel");

//Display Data
const getAllDetails = async (req, res, next) => {
  let clinic;
  try {
    clinic = await ClinicModel.find();
  } catch (err) {
    console.log(err);
  }
  if (!clinic) {
    return res.status(404).json({ message: "Data not found" });
  }
  return res.status(200).json({ clinic });
};

//Insert Data
const addData = async (req, res, next) => {
  const { clinicname, clinicID, location, details } = req.body;

  let clinic;

  try {
    clinic = new ClinicModel({
      clinicname,
      clinicID,
      location,
      details,
    });
    await clinic.save();
  } catch (err) {
    console.log(err);
  }
  if (!clinic) {
    return res.status(404).json({ message: "unable to add data" });
  }
  return res.status(200).json({ clinic });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let clinic;
  try {
    clinic = await ClinicModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!clinic) {
    return res.status(404).json({ message: "Data Not Found" });
  }
  return res.status(200).json({ clinic });
};

//Update Details
const updateData = async (req, res, next) => {
  const id = req.params.id;
  const { clinicname, clinicID, location, details } = req.body;

  let clinic;

  try {
    clinic = await ClinicModel.findByIdAndUpdate(id, {
      clinicname: clinicname,
      clinicID: clinicID,
      location: location,
      details: details,
    });
    clinic = await clinic.save();
  } catch (err) {
    console.log(err);
  }
  if (!clinic) {
    return res.status(404).json({ message: "Unable to Update data" });
  }
  return res.status(200).json({ clinic });
};

//Delete data
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let clinic;

  try {
    clinic = await ClinicModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!clinic) {
    return res.status(404).json({ message: "Unable to Delete Details" });
  }
  return res.status(200).json({ clinic });
};

exports.getAllDetails = getAllDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;
