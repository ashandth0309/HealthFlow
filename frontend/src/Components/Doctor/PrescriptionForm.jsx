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
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const PrescriptionForm = () => {
  const location = useLocation();
  const doctor = JSON.parse(sessionStorage.getItem("doctor"));
  const prescriptionRef = useRef();
  
  // Get patient data from navigation state
  const passedPatient = location.state?.patient;
  
  // Mock patient data - replace with actual API call
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

  // Initialize form values with passed patient data
  const [formValues, setFormValues] = useState({
    firstName: passedPatient ? passedPatient.name.split(' ')[0] : "",
    lastName: passedPatient ? passedPatient.name.split(' ').slice(1).join(' ') : "",
    age: passedPatient ? passedPatient.age : "",
    dob: passedPatient ? new Date(passedPatient.dob) : null,
    gender: passedPatient ? passedPatient.gender : "",
    email: doctor?.email || "",
    rx: "",
    date: new Date(),
    patientEmail: passedPatient ? passedPatient.email : "",
  });

  const [errors, setErrors] = useState({});

  // Mock current prescriptions data - you can replace this with actual API call
  useEffect(() => {
    const mockPrescriptions = [
      { medication: "Lisinopril", dosage: "10mg", frequency: "Once Daily", duration: "30 Days", notes: "For hypertension" },
      { medication: "Atorvastatin", dosage: "20mg", frequency: "Once Daily", duration: "90 Days", notes: "Take at bedtime" },
      { medication: "Paracetamol", dosage: "500mg", frequency: "As Needed", duration: "7 Days", notes: "Max 4 doses/day" }
    ];
    setCurrentPrescriptions(mockPrescriptions);
  }, []);

  // Auto-select patient if data was passed
  useEffect(() => {
    if (passedPatient) {
      // Create a mock patient ID for the passed patient
      const mockPatientId = "P-" + Math.random().toString(36).substr(2, 6);
      
      const patientData = {
        id: mockPatientId,
        name: passedPatient.name,
        email: passedPatient.email,
        allergies: ["Penicillin"], // You can pass these from medical record
        conditions: ["Hypertension"] // You can pass these from medical record
      };
      
      setSelectedPatient(patientData);
      
      // Add to patients list if not already there
      setPatients(prev => {
        const exists = prev.find(p => p.email === passedPatient.email);
        if (!exists) {
          return [...prev, patientData];
        }
        return prev;
      });
    }
  }, [passedPatient]);

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
      
      Swal.fire({
        title: "Success!",
        text: "Medication added successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please fill all required medication fields",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (date, field) => {
    setFormValues({
      ...formValues,
      [field]: date,
    });
  };

  const validate = () => {
    let tempErrors = {};
    const nameRegex = /^[A-Za-z]+$/;

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

    tempErrors.rx = formValues.rx ? "" : "Prescription (Rx) is required.";

    tempErrors.date = formValues.date ? "" : "Date is required.";

    setErrors(tempErrors);

    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleClear = () => {
    setFormValues({
      firstName: passedPatient ? passedPatient.name.split(' ')[0] : "",
      lastName: passedPatient ? passedPatient.name.split(' ').slice(1).join(' ') : "",
      age: passedPatient ? passedPatient.age : "",
      dob: passedPatient ? new Date(passedPatient.dob) : null,
      gender: passedPatient ? passedPatient.gender : "",
      email: doctor?.email || "",
      rx: "",
      date: new Date(),
      patientEmail: passedPatient ? passedPatient.email : "",
    });
    setErrors({});
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      notes: ""
    });
  };

  const generatePDF = async () => {
    if (!selectedPatient) {
      Swal.fire({
        title: "Error!",
        text: "Please select a patient first",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Create PDF document
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
      
      Swal.fire({
        title: "Success!",
        text: "PDF prescription generated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to generate PDF",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const url = "http://localhost:8081/prescriptions/prescriptions";
        const method = "POST";

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formValues,
            medications: currentPrescriptions
          }),
        });

        const result = await response.json();
        if (response.status === 201 || response.status === 200) {
          await axios.post(`http://localhost:8081/prescriptions/mailSend`, {
            email: formValues.patientEmail,
            rx: formValues.rx,
          });
        }

        if (response.ok) {
          // Generate PDF after successful submission
          await generatePDF();
          
          await Swal.fire({
            title: "Success!",
            text: "Prescription successfully submitted and PDF generated.",
            icon: "success",
            confirmButtonText: "OK",
          });
          // Navigate back to patient medical record or wherever appropriate
          window.location.href = "/PatientsPage";
        } else {
          throw new Error(result.message || "An error occurred");
        }
      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text: error.message || "An error occurred while submitting the prescription.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Hidden div for PDF content (alternative method)
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
    <Box sx={{ maxWidth: "1200px", margin: "20px auto", padding: "20px" }}>
      {/* Hidden PDF Template */}
      <PrescriptionPDFTemplate />
      
      {/* Patient Selection Section */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Select Patient
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Choose Patient</InputLabel>
            <Select
              value={selectedPatient?.id || ""}
              onChange={(e) => handlePatientSelect(e.target.value)}
              label="Choose Patient"
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name} (ID: {patient.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedPatient && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Patient:</strong> {selectedPatient.name} (ID: {selectedPatient.id})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Allergies:</strong> {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(", ") : "None"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Conditions:</strong> {selectedPatient.conditions.join(", ")}
              </Typography>
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
                New Prescription
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="First Name"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleInputChange}
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
                      label="Rx"
                      name="rx"
                      multiline
                      rows={6}
                      value={formValues.rx}
                      onChange={handleInputChange}
                      error={!!errors.rx}
                      helperText={errors.rx}
                      placeholder="Enter prescription details, instructions, and any additional notes for the patient..."
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
              </form>
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
                Current Medications
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentPrescriptions.map((prescription, index) => (
                      <TableRow key={index}>
                        <TableCell>{prescription.medication}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{prescription.frequency}</TableCell>
                        <TableCell>{prescription.duration}</TableCell>
                        <TableCell>{prescription.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                    Save & Prescribe
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrescriptionForm;