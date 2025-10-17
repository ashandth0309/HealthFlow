const DentalModel = require("../Model/AppointmentModel");

//Display Data
const getAllDentalDetails = async (req, res, next) => {
  let dental;
  try {
    dental = await DentalModel.find();
  } catch (err) {
    console.log(err); 
  }
  if (!dental) {
    return res.status(404).json({ message: "Data not found" });
  }
  return res.status(200).json({ dental });
};

//Insert Data
const addData = async (req, res, next) => {
  const {
    fullname,
    appointmentID,
    phone,
    email,
    service,
    clinic,
    doctor,
    date,
    timeSlotStart,
    timeSlotEnd,
    appointmentStatus,
    doctorID,
    price,
  } = req.body;

  let dental;

  try {
    dental = new DentalModel({
      fullname,
      appointmentID,
      phone,
      email,
      service,
      clinic,
      doctor,
      date,
      timeSlotStart,
      timeSlotEnd,
      appointmentStatus,
      doctorID,
      price,
    });
    await dental.save();
  } catch (err) {
    console.log(err);
  }
  if (!dental) {
    return res.status(404).json({ message: "unable to add data" });
  }
  return res.status(200).json({ dental });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let dental;
  try {
    dental = await DentalModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!dental) {
    return res.status(404).json({ message: "Data Not Found" });
  }
  return res.status(200).json({ dental });
};

//Update Details
const updateDentalData = async (req, res, next) => {
  const id = req.params.id;
  const {
    fullname,
    appointmentID,
    phone,
    email,
    service,
    clinic,
    doctor,
    date,
    timeSlotStart,
    timeSlotEnd,
    appointmentStatus,
    doctorID,
    price,
  } = req.body;

  let dental;

  try {
    dental = await DentalModel.findByIdAndUpdate(id, {
      fullname: fullname,
      appointmentID: appointmentID,
      phone: phone,
      email: email,
      service: service,
      clinic: clinic,
      doctor: doctor,
      date: date,
      timeSlotStart:timeSlotStart,
      timeSlotEnd:timeSlotEnd,
      appointmentStatus: appointmentStatus,
      doctorID:doctorID,
      price:price,
    });
    dental = await dental.save();
  } catch (err) { 
    console.log(err);
  }
  if (!dental) {
    return res.status(404).json({ message: "Unable to Update data" });
  }
  return res.status(200).json({ dental });
};

//Delete data
const deleteDentalData = async (req, res, next) => {
  const id = req.params.id;

  let dental;

  try {
    dental = await DentalModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!dental) {
    return res.status(404).json({ message: "Unable to Delete Details" });
  }
  return res.status(200).json({ dental });
};

exports.getAllDentalDetails = getAllDentalDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateDentalData = updateDentalData;
exports.deleteDentalData = deleteDentalData;
 