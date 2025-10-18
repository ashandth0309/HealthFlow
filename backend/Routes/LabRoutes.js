const express = require("express");
const router = express.Router();
const LabController = require("../Controllers/LabController");

// Lab Orders
router.get("/orders", LabController.getAllLabOrders);
router.post("/orders", LabController.addLabOrder);
router.get("/orders/:id", LabController.getLabOrderById);
router.put("/orders/:id", LabController.updateLabResults);
router.delete("/orders/:id", LabController.deleteLabOrder);

// Lab Results
router.get("/results", LabController.getAllLabResults);
router.post("/results", LabController.addLabResult);
router.get("/results/:id", LabController.getLabResultById);
router.put("/results/:id", LabController.updateLabResult);

// Adverse Reactions
router.get("/adverse-reactions", LabController.getAllAdverseReactions);
router.post("/adverse-reactions", LabController.addAdverseReaction);
router.get("/adverse-reactions/:id", LabController.getAdverseReactionById);
router.put("/adverse-reactions/:id", LabController.updateAdverseReaction);
router.delete("/adverse-reactions/:id", LabController.deleteAdverseReaction);

// Billing
router.get("/billing", LabController.getAllBillingRecords);
router.post("/billing", LabController.addBillingRecord);
router.get("/billing/:id", LabController.getBillingRecordById);
router.put("/billing/:id", LabController.updateBillingRecord);

module.exports = router;