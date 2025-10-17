const DoctorModel = require("../Model/DoctorModel");

//Display Data
const getAllDetails = async (req, res, next) => {
  let doctorfunction;
  try {
    doctorfunction = await DoctorModel.find();
  } catch (err) {
    console.log(err);
  }
  if (!doctorfunction) {
    return res.status(404).json({ message: "Data not found" });
  }
  return res.status(200).json({ doctorfunction });
};

//Insert Data
const addData = async (req, res, next) => {
  const {
    doctorName,
    doctorID,
    gender,
    gmail,
    clinic,
    timeSlotStart,
    timeSlotEnd,
    price,
    date,
  } = req.body;

  let doctorfunction;

  try {
    doctorfunction = new DoctorModel({
      doctorName,
      doctorID,
      gender,
      gmail,
      clinic,
      timeSlotStart,
      timeSlotEnd,
      date,
      price,
    });
    await doctorfunction.save();
  } catch (err) {
    console.log(err);
  }
  if (!doctorfunction) {
    return res.status(404).json({ message: "unable to add data" });
  }
  return res.status(200).json({ doctorfunction });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let doctorfunction;
  try {
    doctorfunction = await DoctorModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!doctorfunction) {
    return res.status(404).json({ message: "Data Not Found" });
  }
  return res.status(200).json({ doctorfunction });
};

//Update Details
const updateData = async (req, res, next) => {
  const id = req.params.id;
  const {
    doctorName,
    doctorID,
    gender,
    gmail,
    clinic,
    timeSlotStart,
    timeSlotEnd,
    date,
    price,
  } = req.body;

  let doctorfunction;

  try {
    doctorfunction = await DoctorModel.findByIdAndUpdate(id, {
      doctorName: doctorName,
      doctorID: doctorID,
      gender: gender,
      gmail: gmail,
      clinic: clinic,
      timeSlotStart: timeSlotStart,
      timeSlotEnd: timeSlotEnd,
      date: date,
      price: price,
    });
    doctorfunction = await doctorfunction.save();
  } catch (err) {
    console.log(err);
  }
  if (!doctorfunction) {
    return res.status(404).json({ message: "Unable to Update data" });
  }
  return res.status(200).json({ doctorfunction });
};

//Delete data
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let doctorfunction;

  try {
    doctorfunction = await DoctorModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!doctorfunction) {
    return res.status(404).json({ message: "Unable to Delete Details" });
  }
  return res.status(200).json({ doctorfunction });
};

const checkSession = async (req, res, next) => {
  const { doctorName, date, timeSlotStart, timeSlotEnd } = req.body;

  let existingSession;
  try {
    existingSession = await DoctorModel.findOne({
      doctorName,
      date,
      timeSlotStart,
      timeSlotEnd,
    });
  } catch (err) {
    console.log(err);
  }

  if (existingSession) {
    return res
      .status(200)
      .json({ exists: true, message: "Session already exists" });
  } else {
    return res
      .status(200)
      .json({ exists: false, message: "Session is available" });
  }
};

exports.getAllDetails = getAllDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.checkSession = checkSession;
