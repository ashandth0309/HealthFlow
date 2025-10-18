import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Autocomplete
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const PrescriptionForm = ({ selectedPrescription, patientMail, onClose }) => {
  const location = useLocation();
  const doctor = JSON.parse(sessionStorage.getItem("doctor")) || {
    id: "doc-123",
    firstName: "John",
    lastName: "Doe",
    email: "doctor@hospital.com",
    licenseNumber: "MD-12345"
  };
  const prescriptionRef = useRef();
  
  const [patients, setPatients] = useState([
    { id: "P-789012", name: "Jane Doe", email: "jane.doe@example.com", allergies: ["Penicillin"], conditions: ["Hypertension", "Renal Impairment"] },
    { id: "P-789013", name: "John Smith", email: "john.smith@example.com", allergies: ["Sulfa"], conditions: ["Diabetes"] },
    { id: "P-789014", name: "Alice Johnson", email: "alice.johnson@example.com", allergies: [], conditions: ["Asthma"] }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPrescriptions, setCurrentPrescriptions] = useState([]);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: ""
  });

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    age: "",
    dob: null,
    gender: "",
    email: doctor?.email || "",
    rx: "",
    date: new Date(),
    patientEmail: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [touched, setTouched] = useState({}); // Track which fields have been touched

  // Load data when component mounts or when location state changes
  useEffect(() => {
    const patientData = location.state?.patient;
    
    if (patientData) {
      // Auto-fill form with patient data from navigation
      setFormValues({
        firstName: patientData.firstName || patientData.name?.split(' ')[0] || "",
        lastName: patientData.lastName || patientData.name?.split(' ').slice(1).join(' ') || "",
        age: patientData.age || "",
        dob: patientData.dob ? new Date(patientData.dob) : null,
        gender: patientData.gender || "",
        email: doctor?.email || "",
        rx: "",
        date: new Date(),
        patientEmail: patientData.email || patientData.patientEmail || "",
      });

      // Also update selected patient
      const patientFromList = patients.find(p => p.email === patientData.email);
      if (patientFromList) {
        setSelectedPatient(patientFromList);
      }
    } else if (selectedPrescription) {
      // Edit mode
      setFormValues({
        firstName: selectedPrescription.firstName || "",
        lastName: selectedPrescription.lastName || "",
        age: selectedPrescription.age || "",
        dob: selectedPrescription.dob ? new Date(selectedPrescription.dob) : null,
        gender: selectedPrescription.gender || "",
        email: selectedPrescription.email || doctor?.email || "",
        rx: selectedPrescription.rx || "",
        date: selectedPrescription.date ? new Date(selectedPrescription.date) : new Date(),
        patientEmail: selectedPrescription.patientEmail || "",
      });

      if (selectedPrescription.medications) {
        setCurrentPrescriptions(selectedPrescription.medications);
      }

      const patient = patients.find(p => p.email === selectedPrescription.patientEmail);
      if (patient) {
        setSelectedPatient(patient);
      }
    } else if (patientMail) {
      // New prescription with patient email
      setFormValues(prev => ({
        ...prev,
        patientEmail: patientMail
      }));
    }
  }, [location.state, selectedPrescription, patientMail, doctor, patients]);

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    
    if (patient) {
      const nameParts = patient.name.split(' ');
      setFormValues(prev => ({
        ...prev,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || '',
        patientEmail: patient.email
      }));
    }
  };

  const handleNewMedicationChange = (field, value) => {
    setNewMedication(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency && newMedication.duration) {
      const newMed = {
        medication: newMedication.name,
        dosage: newMedication.dosage,
        frequency: newMedication.frequency,
        duration: newMedication.duration,
        notes: newMedication.notes
      };
      
      setCurrentPrescriptions(prev => [...prev, newMed]);
      setNewMedication({
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        notes: ""
      });
      
      showSnackbar("Medication added successfully", "success");
    } else {
      showSnackbar("Please fill all required medication fields", "error");
    }
  };

  const handleRemoveMedication = (index) => {
    setCurrentPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFieldBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleDateChange = (date, field) => {
    setFormValues({
      ...formValues,
      [field]: date,
    });

    // Clear error when date is selected
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const validate = () => {
    let tempErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    // Only validate required fields
    tempErrors.firstName = formValues.firstName
      ? nameRegex.test(formValues.firstName)
        ? ""
        : "First Name must contain only letters."
      : "First Name is required.";

    tempErrors.lastName = formValues.lastName
      ? nameRegex.test(formValues.lastName)
        ? ""
        : "Last Name must contain only letters."
      : "Last Name is required.";

    tempErrors.age =
      formValues.age && formValues.age > 0 ? "" : "Valid age is required.";

    tempErrors.dob = formValues.dob ? "" : "Date of Birth is required.";

    tempErrors.gender = formValues.gender ? "" : "Gender is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    tempErrors.email = formValues.email
      ? emailRegex.test(formValues.email)
        ? ""
        : "Email is not valid."
      : "Email is required.";

    // Make prescription details (rx) optional
    tempErrors.rx = ""; // No validation for prescription details

    tempErrors.date = formValues.date ? "" : "Date is required.";

    setErrors(tempErrors);

    // Only validate required fields (excluding rx)
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleClear = () => {
    setFormValues({
      firstName: "",
      lastName: "",
      age: "",
      dob: null,
      gender: "",
      email: doctor?.email || "",
      rx: "",
      date: new Date(),
      patientEmail: "",
    });
    setErrors({});
    setTouched({});
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      notes: ""
    });
    setCurrentPrescriptions([]);
    setSelectedPatient(null);
  };

  const generatePDF = async () => {
    if (!formValues.firstName || !formValues.lastName) {
      showSnackbar("Please fill patient information first", "error");
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204);
      doc.text("MEDICAL PRESCRIPTION", 105, 20, { align: 'center' });
      
      // Add hospital/clinic info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Healthcare Medical Center", 20, 35);
      doc.text("123 Medical Drive, City, State 12345", 20, 42);
      doc.text("Phone: 0743864204 | Email: info@healthcare.com", 20, 49);
      
      // Add date
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Date: ${formValues.date ? formValues.date.toLocaleDateString() : new Date().toLocaleDateString()}`, 150, 35);
      
      // Add patient information section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("PATIENT INFORMATION", 20, 65);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 67, 190, 67);
      
      doc.setFontSize(10);
      doc.text(`Name: ${formValues.firstName} ${formValues.lastName}`, 20, 77);
      doc.text(`Date of Birth: ${formValues.dob ? formValues.dob.toLocaleDateString() : 'N/A'}`, 20, 84);
      doc.text(`Age: ${formValues.age} years`, 20, 91);
      doc.text(`Gender: ${formValues.gender}`, 20, 98);
      doc.text(`Email: ${formValues.patientEmail}`, 100, 77);
      
      // Add doctor information
      doc.text(`Prescribing Doctor: Dr. ${doctor?.firstName || 'John'} ${doctor?.lastName || 'Doe'}`, 100, 84);
      doc.text(`License No: ${doctor?.licenseNumber || 'MD-12345'}`, 100, 91);
      
      // Add medications section
      doc.setFontSize(14);
      doc.text("PRESCRIBED MEDICATIONS", 20, 115);
      doc.line(20, 117, 190, 117);
      
      let yPosition = 127;
      
      if (currentPrescriptions.length > 0) {
        currentPrescriptions.forEach((med, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${index + 1}. ${med.medication}`, 25, yPosition);
          doc.setFont(undefined, 'normal');
          doc.text(`   Dosage: ${med.dosage}`, 25, yPosition + 7);
          doc.text(`   Frequency: ${med.frequency}`, 25, yPosition + 14);
          doc.text(`   Duration: ${med.duration}`, 25, yPosition + 21);
          if (med.notes) {
            doc.text(`   Instructions: ${med.notes}`, 25, yPosition + 28);
            yPosition += 35;
          } else {
            yPosition += 28;
          }
        });
      } else {
        doc.text("No medications prescribed", 25, yPosition);
        yPosition += 10;
      }
      
      // Add additional instructions
      if (formValues.rx) {
        yPosition += 10;
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.text("ADDITIONAL INSTRUCTIONS", 20, yPosition);
        doc.line(20, yPosition + 2, 190, yPosition + 2);
        
        doc.setFontSize(10);
        const splitInstructions = doc.splitTextToSize(formValues.rx, 170);
        doc.text(splitInstructions, 20, yPosition + 12);
      }
      
      // Add warnings and notes
      const finalY = doc.internal.pageSize.height - 40;
      doc.setFontSize(8);
      doc.setTextColor(150, 0, 0);
      doc.text("IMPORTANT: This prescription should be taken exactly as directed. Do not share medications.", 20, finalY);
      doc.text("Keep all medicines out of reach of children. Contact your doctor if side effects occur.", 20, finalY + 6);
      
      // Add signature area
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("Doctor's Signature: _________________________", 20, finalY + 20);
      doc.text(`Dr. ${doctor?.firstName || 'John'} ${doctor?.lastName || 'Doe'}`, 140, finalY + 20);
      
      // Save the PDF
      const fileName = `Prescription_${formValues.firstName}_${formValues.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      showSnackbar("PDF prescription generated successfully", "success");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      showSnackbar("Failed to generate PDF", "error");
    }
  };

  // Save to localStorage as fallback
  const saveToLocalStorage = (prescriptionData) => {
    try {
      const existingPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
      const newPrescription = {
        ...prescriptionData,
        _id: selectedPrescription?._id || `prescription-${Date.now()}`,
        createdAt: new Date().toISOString(),
        doctorId: doctor?.id || "doc-123"
      };

      let updatedPrescriptions;
      if (selectedPrescription) {
        // Update existing
        updatedPrescriptions = existingPrescriptions.map(p => 
          p._id === selectedPrescription._id ? newPrescription : p
        );
      } else {
        // Add new
        updatedPrescriptions = [...existingPrescriptions, newPrescription];
      }

      localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showSnackbar("Please fix the form errors before submitting", "error");
      return;
    }

    try {
      const prescriptionData = {
        ...formValues,
        medications: currentPrescriptions,
        doctorId: doctor?.id || "doc-123",
        dob: formValues.dob ? formValues.dob.toISOString() : null,
        date: formValues.date ? formValues.date.toISOString() : new Date().toISOString()
      };

      let backendSuccess = false;
      
      // Try backend first
      try {
        let url = "http://localhost:8081/prescriptions/prescriptions";
        let method = "POST";

        if (selectedPrescription && selectedPrescription._id) {
          url = `http://localhost:8081/api/prescriptions/${selectedPrescription._id}`;
          method = "PUT";
        }

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionData),
        });

        if (response.ok) {
          backendSuccess = true;
          const result = await response.json();
          console.log("Backend response:", result);
        }
      } catch (backendError) {
        console.warn("Backend not available, using localStorage:", backendError);
      }

      // If backend fails, use localStorage
      if (!backendSuccess) {
        const localStorageSuccess = saveToLocalStorage(prescriptionData);
        if (!localStorageSuccess) {
          throw new Error("Failed to save prescription");
        }
      }

      // Generate PDF
      await generatePDF();
      
      // Show success message
      await Swal.fire({
        title: "Success!",
        text: selectedPrescription 
          ? "Prescription updated successfully!" 
          : "Prescription submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      
      // Close form and refresh
      if (onClose) {
        onClose();
      } else {
        window.location.href = "/prescriptions";
      }
      
    } catch (error) {
      console.error("Error submitting prescription:", error);
      await Swal.fire({
        title: "Error!",
        text: error.message || "An error occurred while submitting the prescription.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const PrescriptionPDFTemplate = () => (
    <div style={{ display: 'none' }}>
      <div ref={prescriptionRef} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#0066cc', margin: 0 }}>MEDICAL PRESCRIPTION</h2>
          <p style={{ color: '#666', fontSize: '12px', margin: '5px 0' }}>
            Healthcare Medical Center<br />
            123 Medical Drive, City, State 12345<br />
            Phone: (555) 123-4567 | Email: info@healthcare.com
          </p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>Patient:</strong> {formValues.firstName} {formValues.lastName}<br />
              <strong>DOB:</strong> {formValues.dob ? formValues.dob.toLocaleDateString() : 'N/A'}<br />
              <strong>Age:</strong> {formValues.age} years<br />
              <strong>Gender:</strong> {formValues.gender}
            </div>
            <div>
              <strong>Date:</strong> {formValues.date ? formValues.date.toLocaleDateString() : new Date().toLocaleDateString()}<br />
              <strong>Doctor:</strong> Dr. {doctor?.firstName || 'John'} {doctor?.lastName || 'Doe'}<br />
              <strong>License:</strong> {doctor?.licenseNumber || 'MD-12345'}
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>PRESCRIBED MEDICATIONS</h3>
          {currentPrescriptions.length > 0 ? (
            currentPrescriptions.map((med, index) => (
              <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee' }}>
                <strong>{index + 1}. {med.medication}</strong><br />
                <strong>Dosage:</strong> {med.dosage}<br />
                <strong>Frequency:</strong> {med.frequency}<br />
                <strong>Duration:</strong> {med.duration}<br />
                {med.notes && <><strong>Instructions:</strong> {med.notes}</>}
              </div>
            ))
          ) : (
            <p>No medications prescribed</p>
          )}
        </div>
        
        {formValues.rx && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>ADDITIONAL INSTRUCTIONS</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{formValues.rx}</p>
          </div>
        )}
        
        <div style={{ marginTop: '30px', fontSize: '10px', color: '#960000' }}>
          <p><strong>IMPORTANT:</strong> This prescription should be taken exactly as directed. Do not share medications.</p>
          <p>Keep all medicines out of reach of children. Contact your doctor if side effects occur.</p>
        </div>
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #000', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>Doctor's Signature:</strong> _________________________
            </div>
            <div>
              <strong>Dr. {doctor?.firstName || 'John'} {doctor?.lastName || 'Doe'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "0px" }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />

      {/* Hidden PDF Template */}
      <PrescriptionPDFTemplate />
      
      {/* Patient Selection Section - FIXED */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Select Patient
          </Typography>
          
          <Autocomplete
            freeSolo
            options={patients}
            getOptionLabel={(option) => 
              typeof option === 'string' ? option : `${option.name} (ID: ${option.id})`
            }
            value={selectedPatient}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                // User typed a custom value
                setSelectedPatient({ 
                  id: 'custom', 
                  name: newValue, 
                  email: '', 
                  allergies: [], 
                  conditions: [] 
                });
                const nameParts = newValue.split(' ');
                setFormValues(prev => ({
                  ...prev,
                  firstName: nameParts[0] || '',
                  lastName: nameParts.slice(1).join(' ') || '',
                  patientEmail: ''
                }));
              } else if (newValue && newValue.id) {
                // User selected from dropdown
                handlePatientSelect(newValue.id);
              } else {
                // Clear selection
                setSelectedPatient(null);
                setFormValues(prev => ({
                  ...prev,
                  firstName: '',
                  lastName: '',
                  patientEmail: ''
                }));
              }
            }}
            onInputChange={(event, newInputValue) => {
              // Allow typing even when not selecting from dropdown
              if (newInputValue && !patients.some(p => p.name === newInputValue)) {
                // User is typing a custom patient name
                const nameParts = newInputValue.split(' ');
                setFormValues(prev => ({
                  ...prev,
                  firstName: nameParts[0] || '',
                  lastName: nameParts.slice(1).join(' ') || ''
                }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search or Select Patient"
                variant="outlined"
                fullWidth
                placeholder="Type patient name or select from list"
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body1">
                    {option.name} (ID: {option.id})
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {option.email} • Allergies: {option.allergies.length > 0 ? option.allergies.join(", ") : "None"}
                  </Typography>
                </Box>
              </li>
            )}
          />

          {selectedPatient && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Patient:</strong> {selectedPatient.name} {selectedPatient.id !== 'custom' && `(ID: ${selectedPatient.id})`}
              </Typography>
              {selectedPatient.id !== 'custom' && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Allergies:</strong> {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(", ") : "None"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Conditions:</strong> {selectedPatient.conditions.join(", ")}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column - Prescription Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ marginBottom: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary">
                {selectedPrescription ? "Edit Prescription" : "New Prescription"}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="First Name"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Last Name"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Age"
                    name="age"
                    type="number"
                    value={formValues.age}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    error={!!errors.age}
                    helperText={errors.age}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DatePicker
                    selected={formValues.dob}
                    onChange={(date) => handleDateChange(date, "dob")}
                    dateFormat="MM/dd/yyyy"
                    customInput={
                      <TextField
                        variant="outlined"
                        label="Date Of Birth"
                        fullWidth
                        error={!!errors.dob}
                        helperText={errors.dob}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Gender"
                    name="gender"
                    select
                    value={formValues.gender}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    error={!!errors.gender}
                    helperText={errors.gender}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Patient Email"
                    name="patientEmail"
                    value={formValues.patientEmail}
                    onChange={handleInputChange}
                    placeholder="patient@example.com"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Prescription Details"
                    name="rx"
                    multiline
                    rows={4}
                    value={formValues.rx}
                    onChange={handleInputChange}
                    placeholder="Enter prescription details, instructions, and any additional notes for the patient..."
                    // Removed error props to make this field optional
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    selected={formValues.date}
                    onChange={(date) => handleDateChange(date, "date")}
                    dateFormat="MM/dd/yyyy"
                    customInput={
                      <TextField
                        variant="outlined"
                        label="Date"
                        fullWidth
                        error={!!errors.date}
                        helperText={errors.date}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Add New Medication Section */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Add New Medication
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Medication Name"
                    value={newMedication.name}
                    onChange={(e) => handleNewMedicationChange("name", e.target.value)}
                    placeholder="e.g., Amoxicillin"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dosage"
                    value={newMedication.dosage}
                    onChange={(e) => handleNewMedicationChange("dosage", e.target.value)}
                    placeholder="e.g., 500mg"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Frequency"
                    value={newMedication.frequency}
                    onChange={(e) => handleNewMedicationChange("frequency", e.target.value)}
                    placeholder="e.g., Twice daily"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Duration"
                    value={newMedication.duration}
                    onChange={(e) => handleNewMedicationChange("duration", e.target.value)}
                    placeholder="e.g., 7 days"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Notes (Optional)"
                    value={newMedication.notes}
                    onChange={(e) => handleNewMedicationChange("notes", e.target.value)}
                    placeholder="e.g., Take with food"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddMedication}
                    fullWidth
                  >
                    Add Medication
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Patient Information and Current Prescriptions */}
        <Grid item xs={12} md={6}>
          {/* Critical Alerts */}
          <Card sx={{ marginBottom: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Critical Alerts
              </Typography>
              {selectedPatient?.allergies.includes("Penicillin") && (
                <Alert severity="warning" sx={{ marginBottom: 1 }}>
                  Drug allergy alert: Penicillin allergy detected. Avoid Amoxicillin and related antibiotics.
                </Alert>
              )}
              <Alert severity="error" sx={{ marginBottom: 1 }}>
                Potential drug interaction: Warfarin and Ibuprofen. Increased bleeding risk.
              </Alert>
              <Alert severity="info">
                Always check for drug interactions and contraindications before prescribing.
              </Alert>
            </CardContent>
          </Card>

          {/* Current Prescriptions */}
          <Card sx={{ marginBottom: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Current Medications ({currentPrescriptions.length})
              </Typography>
              {currentPrescriptions.length === 0 ? (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                  No medications added yet
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Medication</TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentPrescriptions.map((prescription, index) => (
                        <TableRow key={index}>
                          <TableCell>{prescription.medication}</TableCell>
                          <TableCell>{prescription.dosage}</TableCell>
                          <TableCell>{prescription.frequency}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveMedication(index)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ marginBottom: 1 }}
                  >
                    {selectedPrescription ? "Update Prescription" : "Save & Prescribe"}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={generatePDF}
                    sx={{ marginBottom: 1 }}
                  >
                    Generate PDF
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  >
                    Order Diagnostics
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  >
                    Refer to Specialist
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleClear}
                  >
                    Clear All
                  </Button>
                </Grid>
                {onClose && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrescriptionForm;