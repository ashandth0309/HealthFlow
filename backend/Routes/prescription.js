const express = require('express');
const router = express.Router();
const Prescription = require('../Model/Prescription');

// Get all prescriptions
router.get('/prescriptions', async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get prescriptions by patient email
router.get('/prescriptions/patient/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const prescriptions = await Prescription.find({ patientEmail: email });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get prescription by ID
router.get('/prescriptions/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new prescription
router.post('/prescriptions', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      dob,
      patientEmail,
      email,
      date,
      rx,
      medications
    } = req.body;

    const prescription = new Prescription({
      firstName,
      lastName,
      age,
      gender,
      dob,
      patientEmail,
      email,
      date,
      rx,
      medications
    });

    const newPrescription = await prescription.save();
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update prescription
router.put('/prescriptions/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete prescription
router.delete('/prescriptions/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;