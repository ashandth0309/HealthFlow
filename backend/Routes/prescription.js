const express = require('express');
const router = express.Router();
const Prescription = require('../Model/prescription');

// Get all prescriptions
router.get('/api/prescriptions', async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get prescriptions by doctor
router.get('/api/prescriptions/doctor/:doctorId', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.params.doctorId }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed dummy data
router.post('/api/prescriptions/seed', async (req, res) => {
  try {
    const dummyPrescriptions = [
      {
        firstName: "John",
        lastName: "Doe",
        age: 45,
        dob: new Date("1978-05-15"),
        gender: "Male",
        email: "doctor@hospital.com",
        patientEmail: "john.doe@example.com",
        rx: "Take medication as prescribed. Follow up in 2 weeks.",
        date: new Date(),
        medications: [
          {
            medication: "Lisinopril",
            dosage: "10mg",
            frequency: "Once Daily",
            duration: "30 Days",
            notes: "For blood pressure"
          }
        ],
        doctorId: "doc-123"
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        age: 32,
        dob: new Date("1991-08-22"),
        gender: "Female",
        email: "doctor@hospital.com",
        patientEmail: "jane.smith@example.com",
        rx: "Complete the full course of antibiotics.",
        date: new Date(),
        medications: [
          {
            medication: "Amoxicillin",
            dosage: "500mg",
            frequency: "Three times daily",
            duration: "7 Days",
            notes: "Take with food"
          }
        ],
        doctorId: "doc-123"
      }
    ];

    await Prescription.insertMany(dummyPrescriptions);
    res.json({ message: "Dummy data added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new prescription
router.post('/prescriptions/prescriptions', async (req, res) => {
  try {
    const prescriptionData = {
      ...req.body,
      date: new Date(req.body.date),
      dob: new Date(req.body.dob)
    };

    const prescription = new Prescription(prescriptionData);
    const savedPrescription = await prescription.save();
    
    res.status(201).json(savedPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update prescription
router.put('/api/prescriptions/:id', async (req, res) => {
  try {
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json(updatedPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete prescription
router.delete('/api/prescriptions/:id', async (req, res) => {
  try {
    const deletedPrescription = await Prescription.findByIdAndDelete(req.params.id);
    
    if (!deletedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get prescription by ID
router.get('/api/prescriptions/:id', async (req, res) => {
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

// Email sending endpoint (placeholder - you'll need to implement email service)
router.post('/prescriptions/mailSend', async (req, res) => {
  try {
    const { email, rx } = req.body;
    
    // Here you would integrate with your email service (Nodemailer, SendGrid, etc.)
    console.log(`Sending email to: ${email}`);
    console.log(`Prescription details: ${rx}`);
    
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;