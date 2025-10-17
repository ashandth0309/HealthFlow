const express = require("express");
const router = express.Router();
const DoctorAppointmentController = require("../Controllers/DoctorAppointmentController");

router.get("/", DoctorAppointmentController.getAllDetails);
router.post("/", DoctorAppointmentController.addData);
router.get("/:id", DoctorAppointmentController.getById);
router.put("/:id", DoctorAppointmentController.updateData);
router.delete("/:id", DoctorAppointmentController.deleteData);

//export
module.exports = router;
