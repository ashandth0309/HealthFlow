const express = require("express");
const router = express.Router();
const DoctorController = require("../Controllers/DoctorController");

router.get("/", DoctorController.getAllDetails);
router.post("/register", DoctorController.registerDoctor);
router.post("/login", DoctorController.loginDoctor);
router.post("/check-session", DoctorController.checkSession);
router.get("/get/:id", DoctorController.getById);
router.put("/update/:id", DoctorController.updateData);
router.delete("/delete/:id", DoctorController.deleteData);

module.exports = router;