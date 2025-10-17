const express = require("express");
const router = express.Router();
const PaymentFunctionController = require("../Controllers/PaymentFunctionControllers");

router.get("/", PaymentFunctionController.getAllDetails);
router.post("/", PaymentFunctionController.addData);
router.get("/:id", PaymentFunctionController.getById);
router.put("/:id", PaymentFunctionController.updateData);
router.delete("/:id", PaymentFunctionController.deleteData);

//export
module.exports = router;
