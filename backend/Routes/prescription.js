const express = require('express');
const router = express.Router();
const {
  getAllPrescriptions,
  getPrescriptionsByDoctor,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  seedDummyData,
  sendEmail
} = require('../Controllers/prescriptionController');

// Get all prescriptions
router.get('/api/prescription', getAllPrescriptions);

// Get prescriptions by doctor
router.get('/api/prescription/doctor/:doctorId', getPrescriptionsByDoctor);

// Get prescription by ID
router.get('/api/prescription/:id', getPrescriptionById);

// Create new prescription
router.post('/prescription/prescription', createPrescription);

// Update prescription
router.put('/api/prescription/:id', updatePrescription);

// Delete prescription
router.delete('/api/prescription/:id', deletePrescription);

// Seed dummy data
router.post('/api/prescription/seed', seedDummyData);

// Email sending endpoint
router.post('/prescription/mailSend', sendEmail);

module.exports = router;