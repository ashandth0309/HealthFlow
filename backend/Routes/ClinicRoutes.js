const express = require("express");
const router = express.Router();
const ClinicController = require("../Controllers/ClinicController");

router.get("/", ClinicController.getAllDetails);
router.post("/", ClinicController.addData);
router.get("/:id", ClinicController.getById);
router.put("/:id", ClinicController.updateData);
router.delete("/:id", ClinicController.deleteData);

//export
module.exports = router;
