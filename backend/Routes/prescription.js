const express = require('express');
const router = express.Router();
const prescriptionSchema = require('../Model/prescription');
const nodemailer = require('nodemailer');

// Create a new prescription
router.post('/prescriptions', async (req, res) => {
    try {
        const newPrescription = new prescriptionSchema(req.body);
        const savedPrescription = await newPrescription.save();
        res.status(201).json(savedPrescription);
    } catch (err) {
        res.status(400).json({ message: 'Error creating prescription', error: err.message });
    }
});

// Get all prescriptions
router.get('/prescriptions', async (req, res) => {
    try {
        const prescriptions = await prescriptionSchema.find();
        res.status(200).json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching prescriptions', error: err.message });
    }
});

// Get a single prescription by ID
router.get('/prescriptions/:id', async (req, res) => {
    try {
        const prescription = await prescriptionSchema.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.status(200).json(prescription);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching prescription', error: err.message });
    }
});

// Update a prescription by ID
router.put('/prescriptions/:id', async (req, res) => {
    try {
        const updatedPrescription = await prescriptionSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPrescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.status(200).json(updatedPrescription);
    } catch (err) {
        res.status(500).json({ message: 'Error updating prescription', error: err.message });
    }
});

// Delete a prescription by ID
router.delete('/prescriptions/:id', async (req, res) => {
    try {
        const deletedPrescription = await prescriptionSchema.findByIdAndDelete(req.params.id);
        if (!deletedPrescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.status(200).json({ message: 'Prescription deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting prescription', error: err.message });
    }
});

router.post('/mailSend', async (req, res) => {
    const { email, rx } = req.body;
    try {
        // Create a Nodemailer transporter using your SMTP settings
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'anjulagehan23@gmail.com', // Your email
                pass: 'pplu cpkl nqlt rtwi', // Your email app password
            },
        });

        // Set up email data
        let mailOptions = {
            from: 'anjulagehan23@gmail.com',
            to: email,
            subject: 'Prescription',
            text: `Your Prescription is: ${rx}`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending error:', error);
                return res.status(400).json({ msg: 'Email not sent.', error });
            } else {
                // Include the code in the response
                res.status(200).json({ msg: 'Email sent' });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
