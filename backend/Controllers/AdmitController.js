const AdmitModel = require("../Model/Admit");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadsIMG/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Display Data
const getAllAdmitDetails = async (req, res, next) => {
  try {
    const admit = await AdmitModel.find();
    if (!admit) {
      return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json({ admit });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Insert Data
const addData = async (req, res) => {
  const {
    hospital,
    date,
    fullname,
    dob,
    gender,
    phone,
    address,
    guardian,
    relationship,
    contact,
    admitID,
    nic, // Capture NIC
    medications,
    past,
    symptoms,
    status,
    discharge,
    price,
    birth,
  } = req.body;
  const prescription = path.basename(req.file.path);
  try {
    const admit = new AdmitModel({
      hospital,
      date,
      fullname,
      dob,
      gender,
      phone,
      address,
      guardian,
      relationship,
      contact,
      admitID,
      nic, // Save NIC
      medications,
      past,
      status,
      symptoms,
      prescription,
      price,
      discharge,
      birth,
    });

    await admit.save();
    res.status(200).json({ admit });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add admit record" });
  }
};

// Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const admit = await AdmitModel.findById(id);
    if (!admit) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    return res.status(200).json({ admit });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update Details
const updateAdmitData = async (req, res, next) => {
  const id = req.params.id;
  const {
    hospital,
    date,
    fullname,
    dob,
    status,
    gender,
    phone,
    address,
    guardian,
    relationship,
    contact,
    nic, // Capture NIC for updates
    medications,
    past,
    price,
    symptoms,
    discharge,
    birth,
  } = req.body;
  const prescription = req.file ? path.basename(req.file.path) : undefined;

  try {
    const updatedData = {
      hospital,
      date,
      fullname,
      dob,
      gender,
      phone,
      address,
      guardian,
      relationship,
      contact,
      nic, // Update NIC
      medications,
      past,
      status,
      price,
      symptoms,
      discharge,
      birth,
    };
    if (prescription) {
      updatedData.prescription = prescription;
    }

    const admit = await AdmitModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!admit) {
      return res.status(404).json({ message: "Unable to Update data" });
    }
    return res.status(200).json({ admit });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete Data
const deleteAdmitData = async (req, res, next) => {
  const id = req.params.id;

  let admit;

  try {
    admit = await AdmitModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!admit) {
    return res.status(404).json({ message: "Unable to Delete Details" });
  }
  return res.status(200).json({ admit });
};

// Count Admits
const admitCount = async (req, res) => {
  const { hospital, date } = req.query;

  try {
    // Implement logic to count admits based on hospital and date
    const count = await AdmitModel.countDocuments({ hospital, date });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching admit count", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Admit by NIC
const getByNIC = async (req, res) => {
  const { nic } = req.params;

  let admit;
  try {
    admit = await AdmitModel.findOne({ nic: nic });
  } catch (err) {
    console.log(err);
  }

  if (!admit) {
    return res.status(404).json({ message: "Data not found" });
  }

  return res.status(200).json({ admit });
};

// Get Admit by AdmitID
const getByAdmitID = async (req, res) => {
  const { admitID } = req.params;

  let admit;
  try {
    admit = await AdmitModel.findOne({ admitID: admitID });
  } catch (err) {
    console.log(err);
  }

  if (!admit) {
    return res.status(404).json({ message: "Data not found" });
  }

  return res.status(200).json({ admit });
};

exports.getAllAdmitDetails = getAllAdmitDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateAdmitData = updateAdmitData;
exports.deleteAdmitData = deleteAdmitData;
exports.admitCount = admitCount;
exports.getByNIC = getByNIC;
exports.getByAdmitID = getByAdmitID;
exports.upload = upload;
