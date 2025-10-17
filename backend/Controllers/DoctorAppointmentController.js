const DoctorAppointmentModel = require("../Model/DoctorAppointmentModel");

//Display Data
const getAllDetails = async (req, res, next) => {
  let dappoiment;
  try {
    dappoiment = await DoctorAppointmentModel.find();
  } catch (err) {
    console.log(err);
  }
  if (!dappoiment) {
    return res.status(404).json({ message: "Data not found" });
  }
  return res.status(200).json({ dappoiment });
};

//Insert Data
const addData = async (req, res, next) => {
  const {
    fullname,
    doctorAppoimentID,
    phone,
    gmail,
    date,
    session,
    timeSlot,
    doctorname, 
    location,   
    price,
  } = req.body;

  let dappoiment;

  try {
    dappoiment = new DoctorAppointmentModel({
      fullname,
      doctorAppoimentID,
      phone,
      gmail,
      date,
      session,
      timeSlot,
      doctorname,  
      price,
      location,    
    });
    await dappoiment.save();
  } catch (err) {
    console.log(err);
  }
  if (!dappoiment) {
    return res.status(404).json({ message: "Unable to add data" });
  }
  return res.status(200).json({ dappoiment });
};


//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let dappoiment;
  try {
    dappoiment = await DoctorAppointmentModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!dappoiment) {
    return res.status(404).json({ message: "Data Not Found" });
  }
  return res.status(200).json({ dappoiment });
};

//Update Details
const updateData = async (req, res, next) => {
  const id = req.params.id;
  const {
    fullname,
    doctorAppoimentID,
    phone,
    gmail,
    price,
    date,
    session,
    timeSlot,
    doctorname, 
    location,   
  } = req.body;

  let dappoiment;

  try {
    dappoiment = await DoctorAppointmentModel.findByIdAndUpdate(id, {
      fullname: fullname,
      doctorAppoimentID: doctorAppoimentID,
      phone: phone,
      gmail: gmail,
      date: date,
      session: session,
      price:price,
      timeSlot: timeSlot,
      doctorname: doctorname,  
      location: location,     
    });
    dappoiment = await dappoiment.save();
  } catch (err) {
    console.log(err);
  }
  if (!dappoiment) {
    return res.status(404).json({ message: "Unable to Update data" });
  }
  return res.status(200).json({ dappoiment });
};


//Delete data
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let dappoiment;

  try {
    dappoiment = await DoctorAppointmentModel.findByIdAndDelete(id);
  } catch (err) { 
    console.log(err);
  }
  if (!dappoiment) {
    return res.status(404).json({ message: "Unable to Delete Details" });
  }
  return res.status(200).json({ dappoiment });
};

exports.getAllDetails = getAllDetails; 
exports.addData = addData;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;
