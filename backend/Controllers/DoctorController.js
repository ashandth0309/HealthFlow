const DoctorModel = require("../Model/DoctorModel");
const bcrypt = require('bcryptjs');

// Get all doctors
const getAllDetails = async (req, res, next) => {
    try {
        const doctors = await DoctorModel.find();
        return res.status(200).json({ doctors });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Register new doctor
const registerDoctor = async (req, res, next) => {
    const {
        firstName,
        lastName,
        dob,
        specialisation,
        sheduleTimes,
        locations,
        email,
        password,
        picture
    } = req.body;

    try {
        // Check if email already exists
        const existingDoctor = await DoctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Email is Already Used" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = new DoctorModel({
            firstName,
            lastName,
            dob,
            specialisation,
            sheduleTimes,
            locations,
            email,
            password: hashedPassword,
            picture
        });

        await newDoctor.save();
        return res.status(201).json({ 
            message: "Doctor registered successfully",
            doctor: newDoctor 
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Registration failed" });
    }
};

// Doctor login
const loginDoctor = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const doctor = await DoctorModel.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({ 
            message: "Login successful",
            doctor: {
                _id: doctor._id,
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                email: doctor.email,
                specialisation: doctor.specialisation,
                locations: doctor.locations,
                licenseNumber: doctor.licenseNumber
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Login failed" });
    }
};

// Get doctor by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const doctor = await DoctorModel.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        return res.status(200).json(doctor);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Update doctor data
const updateData = async (req, res, next) => {
    const id = req.params.id;
    const {
        firstName,
        lastName,
        dob,
        specialisation,
        sheduleTimes,
        locations,
        email
    } = req.body;

    try {
        const updatedDoctor = await DoctorModel.findByIdAndUpdate(
            id,
            {
                firstName,
                lastName,
                dob,
                specialisation,
                sheduleTimes,
                locations,
                email
            },
            { new: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        return res.status(200).json({ 
            message: "Profile updated successfully",
            doctor: updatedDoctor 
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Update failed" });
    }
};

// Delete doctor
const deleteData = async (req, res, next) => {
    const id = req.params.id;
    try {
        const deletedDoctor = await DoctorModel.findByIdAndDelete(id);
        if (!deletedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        return res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Delete failed" });
    }
};

// Check session availability (for appointments)
const checkSession = async (req, res, next) => {
    const { doctorName, date, timeSlotStart, timeSlotEnd } = req.body;

    try {
        const existingSession = await DoctorModel.findOne({
            doctorName,
            date,
            timeSlotStart,
            timeSlotEnd,
        });

        if (existingSession) {
            return res.status(200).json({ 
                exists: true, 
                message: "Session already exists" 
            });
        } else {
            return res.status(200).json({ 
                exists: false, 
                message: "Session is available" 
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getAllDetails = getAllDetails;
exports.registerDoctor = registerDoctor;
exports.loginDoctor = loginDoctor;
exports.getById = getById;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.checkSession = checkSession;