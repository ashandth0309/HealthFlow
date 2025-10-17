const SessionModel = require("../Model/SessionModel");

//Display Data
const getAllDetails = async (req, res, next) => {
  let session;
  try {
    session = await SessionModel.find();
  } catch (err) {
    console.log(err);
  }
  if (!session) {
    return res.status(404).json({ message: "Data not found" });
  }
  return res.status(200).json({ session });
};

//Insert Data
const addData = async (req, res, next) => {
  const {
    sessionname,
    location,
    seatcount,
    date,
    sectionID,
    timeslots,
    doctorname,
    speciality,
    price,
  } = req.body;

  let session;
  try {
    session = new SessionModel({
      sessionname,
      location,
      seatcount,
      date,
      sectionID,
      timeslots,
      doctorname,
      speciality,
      price,
    });
    await session.save();
  } catch (err) {
    console.log(err);
  }
  if (!session) {
    return res.status(404).json({ message: "Unable to add data" });
  }
  return res.status(200).json({ session });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let session;
  try {
    session = await SessionModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!session) {
    return res.status(404).json({ message: "Data Not Found" });
  }
  return res.status(200).json({ session });
};

//Update Details
const updateData = async (req, res, next) => {
  const id = req.params.id;
  const {
    sessionname,
    location,
    seatcount,
    starttime,
    sectionID,
    endtime,
    date,
    doctorname,
    speciality,
    price,
  } = req.body;

  let session;

  try {
    session = await SessionModel.findByIdAndUpdate(id, {
      sessionname: sessionname,
      location: location,
      seatcount: seatcount,
      starttime: starttime,
      sectionID: sectionID,
      endtime: endtime,
      date: date,
      doctorname: doctorname,
      speciality: speciality,
      price: price,
    });
    session = await session.save();
  } catch (err) {
    console.log(err);
  }
  if (!session) {
    return res.status(404).json({ message: "Unable to Update data" });
  }
  return res.status(200).json({ session });
};

//Delete data
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let session;

  try {
    session = await SessionModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!session) {
    return res.status(404).json({ message: "Unable to Delete Details" });
  }
  return res.status(200).json({ session });
};
const checkSessionExists = async (req, res, next) => {
  const { date, doctorname, location } = req.body;

  let session;
  try {
    // Query to find a session with the same date, doctorname, and location
    session = await SessionModel.findOne({ date, doctorname, location });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occurred while checking session" });
  }

  if (session) {
    // If session is found, respond with exists: true
    return res.status(200).json({ exists: true });
  } else {
    // If no session is found, respond with exists: false
    return res.status(200).json({ exists: false });
  }
};

exports.getAllDetails = getAllDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.checkSessionExists = checkSessionExists;