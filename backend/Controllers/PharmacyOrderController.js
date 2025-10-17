const PharmacyModel = require("../Model/PharmacyOrderModel");
const path = require("path");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadspharmacyorder/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Display Data
const getAllDetails = async (req, res, next) => {
  try {
    const pharmacy = await PharmacyModel.find();
    if (!pharmacy) {
      return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json({ pharmacy });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Insert Data
const addData = async (req, res, next) => {
  const {
    fullname,
    patientID,
    OrderID,
    phone,
    gmail,
    pharmacyname,
    deliveryMethod,
    address,
    status,
    pharmacyID,
    shipping,
    message,
  } = req.body;
  const prescriptionImg = path.basename(req.file.path); // Get the file path from multer

  try {
    const pharmacy = new PharmacyModel({
      fullname,
      patientID,
      OrderID,
      phone,
      pharmacyID,
      gmail,
      pharmacyname,
      deliveryMethod,
      address,
      prescriptionImg,
      status,
      shipping,
      message,
    });
    await pharmacy.save();
    return res.status(200).json({ pharmacy });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add data" });
  }
};

// Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const pharmacy = await PharmacyModel.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    return res.status(200).json({ pharmacy });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update Details
const updateData = async (req, res, next) => {
  const id = req.params.id;
  const {
    fullname,
    patientID,
    OrderID,
    phone,
    gmail,
    pharmacyname,
    deliveryMethod,
    address,
    status,
    pharmacyID,
    message,
    shipping,
  } = req.body;
  const prescriptionImg = req.file ? path.basename(req.file.path) : undefined; // Get the file path if present

  try {
    const updatedData = {
      fullname,
      patientID,
      OrderID,
      phone,
      gmail,
      pharmacyname,
      deliveryMethod,
      address,
      status,
      pharmacyID,
      shipping,
      message,
    };

    if (prescriptionImg) {
      updatedData.prescriptionImg = prescriptionImg;
    }

    const pharmacy = await PharmacyModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!pharmacy) {
      return res.status(404).json({ message: "Unable to Update data" });
    }
    return res.status(200).json({ pharmacy });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete data
const deleteData = async (req, res, next) => {
  const id = req.params.id;
  try {
    const pharmacy = await PharmacyModel.findByIdAndDelete(id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Unable to Delete Details" });
    }
    return res.status(200).json({ pharmacy });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Export controller methods
exports.getAllDetails = getAllDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.upload = upload;
