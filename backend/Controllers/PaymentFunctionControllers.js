const PaymentFunctionModel = require("../Model/PaymentFunctionModel");

//Display Data
const getAllDetails = async (req, res, next) => {
  let paymentFunction;
  try {
    paymentFunction = await PaymentFunctionModel.find();
  } catch (err) {
    console.log(err);
  }
  if (!paymentFunction) {
    return res.status(404).json({ message: "Data not found" });
  }
  return res.status(200).json({ paymentFunction });
};

//Insert Data
const addData = async (req, res, next) => {
  const {
    paymentID,
    paymentMethod,
    cardname,
    cardnumber,
    cardholdername,
    expdate,
    cvv,
    fullname,
    address,
    contactNo,
    email,
    amount,
    cardID,
  } = req.body;

  let paymentFunction;

  try {
    paymentFunction = new PaymentFunctionModel({
      paymentID,
      paymentMethod,
      cardname,
      cardnumber,
      cardholdername,
      expdate,
      cvv,
      fullname,
      address,
      contactNo,
      email,
      amount,
      cardID,
    });
    await paymentFunction.save();
  } catch (err) {
    console.log(err);
  }
  if (!paymentFunction) {
    return res.status(404).json({ message: "unable to add data" });
  }
  return res.status(200).json({ paymentFunction });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;
  let paymentFunction;
  try {
    paymentFunction = await PaymentFunctionModel.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!paymentFunction) {
    return res.status(404).json({ message: "Data Not Found" });
  }
  return res.status(200).json({ paymentFunction });
};

//Update Details
const updateData = async (req, res, next) => {
  const id = req.params.id;
  const {
    paymentID,
    paymentMethod,
    cardname,
    cardnumber,
    cardholdername,
    expdate,
    cvv,
    fullname,
    address,
    contactNo,
    email,
    amount,
    cardID,
  } = req.body;

  let paymentFunction;

  try {
    paymentFunction = await PaymentFunctionModel.findByIdAndUpdate(id, {
      paymentID: paymentID,
      paymentMethod: paymentMethod,
      cardname: cardname,
      cardnumber: cardnumber,
      cardholdername: cardholdername,
      expdate: expdate,
      cvv: cvv,
      fullname: fullname,
      address: address,
      contactNo: contactNo,
      email: email,
      amount: amount,
      cardID: cardID,
    });
    paymentFunction = await paymentFunction.save();
  } catch (err) {
    console.log(err);
  }
  if (!paymentFunction) {
    return res.status(404).json({ message: "Unable to Update data" });
  }
  return res.status(200).json({ paymentFunction });
};

//Delete data
const deleteData = async (req, res, next) => {
  const id = req.params.id;

  let paymentFunction;

  try {
    paymentFunction = await PaymentFunctionModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!paymentFunction) {
    return res.status(404).json({ message: "Unable to Delete Details" });
  }
  return res.status(200).json({ paymentFunction });
};

exports.getAllDetails = getAllDetails;
exports.addData = addData;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;
