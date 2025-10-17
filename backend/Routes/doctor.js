const express = require('express');
const bcrypt = require('bcryptjs');
const doctorSchema = require('../Model/doctor');
const router = express.Router();

// Register a new doctor
router.route('/register').post(async (req, res) => {
    try {
        const existingDoctor = await doctorSchema.findOne({ email: req.body.email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Email is already used' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const doctor = new doctorSchema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: req.body.dob,
            specialisation: req.body.specialisation,
            sheduleTimes: req.body.sheduleTimes,
            locations: req.body.locations,
            email: req.body.email,
            password: hashedPassword,
            picture: req.body.picture,
        });

        await doctor.save();
        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login a doctor
router.route('/login').post(async (req, res) => {
    try {
        const { email, password } = req.body;

        const doctor = await doctorSchema.findOne({ email });
        if (!doctor) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        const isPasswordMatch = await bcrypt.compare(password, doctor.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        res.status(200).json({ data: doctor, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all doctors
router.route('/getAll').get(async (req, res) => {
    try {
        const doctors = await doctorSchema.find();
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a doctor by ID
router.route('/get/:id').get(async (req, res) => {
    try {
        const doctor = await doctorSchema.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a doctor by ID
router.route('/update/:id').put(async (req, res) => {
    try {
        const { firstName, lastName, dob, specialisation, sheduleTimes, locations, email, password, picture } = req.body;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const updatedData = {
            firstName,
            lastName,
            dob,
            specialisation,
            sheduleTimes,
            locations,
            email,
            picture,
        };

        if (hashedPassword) {
            updatedData.password = hashedPassword;
        }

        const doctor = await doctorSchema.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor updated successfully', doctor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a doctor by ID
router.route('/delete/:id').delete(async (req, res) => {
    try {
        const doctor = await doctorSchema.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
