const express = require("express");
const router = express.Router();
const PharmacyOrderController = require("../Controllers/PharmacyOrderController");

// Middleware for handling file uploads
const upload = PharmacyOrderController.upload.single('prescriptionImg'); // Use .single() for single file uploads

router.get("/", PharmacyOrderController.getAllDetails);
router.post("/", upload, PharmacyOrderController.addData); // Use upload middleware
router.get("/:id", PharmacyOrderController.getById);
router.put("/:id", upload, PharmacyOrderController.updateData); // Use upload middleware
router.delete("/:id", PharmacyOrderController.deleteData);

// Export routes
module.exports = router;
