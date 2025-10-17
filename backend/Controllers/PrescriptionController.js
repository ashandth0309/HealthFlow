const PrescriptionModel = require("../Model/PrescriptionModel");
const nodemailer = require('nodemailer');

// Get all prescriptions
const getAllPrescriptions = async (req, res, next) => {
    try {
        const prescriptions = await PrescriptionModel.find();
        return res.status(200).json(prescriptions);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Create new prescription
const createPrescription = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            age,
            dob,
            gender,
            email,
            patientEmail,
            rx,
            date,
            medications
        } = req.body;

        const newPrescription = new PrescriptionModel({
            firstName,
            lastName,
            age,
            dob,
            gender,
            email,
            patientEmail,
            rx,
            date,
            medications
        });

        await newPrescription.save();
        return res.status(201).json({ 
            message: "Prescription created successfully",
            prescription: newPrescription 
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to create prescription" });
    }
};

// Send prescription email
const sendPrescriptionEmail = async (req, res, next) => {
    const { email, rx } = req.body;

    try {
        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Medical Prescription',
            html: `
                <h2>Medical Prescription</h2>
                <p>Dear Patient,</p>
                <p>Your prescription details:</p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                    ${rx}
                </div>
                <p>Please follow the instructions carefully.</p>
                <p>Best regards,<br>Medical Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to send email" });
    }
};

// Get prescription by ID
const getPrescriptionById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const prescription = await PrescriptionModel.findById(id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        return res.status(200).json(prescription);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Update prescription
const updatePrescription = async (req, res, next) => {
    const id = req.params.id;
    try {
        const updatedPrescription = await PrescriptionModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedPrescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        return res.status(200).json({ 
            message: "Prescription updated successfully",
            prescription: updatedPrescription 
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Update failed" });
    }
};

// Delete prescription
const deletePrescription = async (req, res, next) => {
    const id = req.params.id;
    try {
        const deletedPrescription = await PrescriptionModel.findByIdAndDelete(id);
        if (!deletedPrescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        return res.status(200).json({ message: "Prescription deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Delete failed" });
    }
};

exports.getAllPrescriptions = getAllPrescriptions;
exports.createPrescription = createPrescription;
exports.sendPrescriptionEmail = sendPrescriptionEmail;
exports.getPrescriptionById = getPrescriptionById;
exports.updatePrescription = updatePrescription;
exports.deletePrescription = deletePrescription;