const express = require("express");
const router = express.Router();
const DentalController = require("../Controllers/AppointmentController");

router.get("/", DentalController.getAllDentalDetails);
router.post("/", DentalController.addData);
router.get("/:id", DentalController.getById);
router.put("/:id", DentalController.updateDentalData);
router.delete("/:id", DentalController.deleteDentalData);

//export
module.exports = router;
