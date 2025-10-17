const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const app = express();

dotenv.config();
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Static file serving
app.use("/uploadspharmacyorder", express.static(path.join(__dirname, "uploadspharmacyorder")));
app.use("/uploadsIMG", express.static(path.join(__dirname, "uploadsIMG")));

// API Routes
app.use("/api/pharmacyorder", require("./Routes/PharmacyOrderRoutes.js"));
app.use("/api/pharmacyshop", require("./Routes/PharmacyShopRoute.js"));
app.use("/api/doctorAppointment", require("./Routes/DoctorAppointmentRoute.js"));
app.use("/api/session", require("./Routes/SessionRoute.js"));
app.use("/api/appointment", require("./Routes/AppointmentRoutes.js"));
app.use("/api/clinic", require("./Routes/ClinicRoutes.js"));
app.use("/api/doctor", require("./Routes/DoctorRoutes.js"));
app.use("/api/admit", require("./Routes/AdmitRoutes.js"));
app.use("/api/paymentFunction", require("./Routes/PaymentFunctionRoute.js"));

// Updated Doctor and Prescription Routes (from your new structure)
app.use("/api/doctorFunction", require("./Routes/DoctorRoutes.js")); // Updated doctor routes
app.use("/api/prescriptions", require("./Routes/PrescriptionRoutes.js")); // Updated prescription routes

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    message: "Telemedicine API Server is running!",
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to Telemedicine API Server",
    version: "1.0.0",
    endpoints: {
      doctor: "/api/doctorFunction",
      prescriptions: "/api/prescriptions",
      appointments: "/api/appointment",
      pharmacy: "/api/pharmacyorder",
      clinics: "/api/clinic"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend: http://localhost:5173`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});