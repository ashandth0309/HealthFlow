import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../Doctor/SideBar";
import PrescriptionForm from "./PrescriptionForm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [open, setOpen] = useState(false);
  const [fopen, setFOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const doctor = JSON.parse(sessionStorage.getItem("doctor")) || {
    id: "doc-123",
    firstName: "John",
    lastName: "Doe",
    email: "doctor@hospital.com"
  };
  const prescriptionRef = useRef(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchPrescriptions = async () => {
    try {
      // Try backend first
      const response = await fetch("http://localhost:8081/api/prescriptions/doctor/" + (doctor?.id || "doc-123"));
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
        return;
      }
    } catch (error) {
      console.warn("Backend not available, using localStorage:", error);
    }

    // Fallback to localStorage
    try {
      const localPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
      // Filter by doctor if needed
      const doctorPrescriptions = localPrescriptions.filter(p => p.doctorId === doctor?.id);
      setPrescriptions(doctorPrescriptions);
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      // Load dummy data as last resort
      const dummyData = [
        {
          _id: "1",
          firstName: "John",
          lastName: "Doe",
          age: 45,
          dob: "1978-05-15",
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
          _id: "2",
          firstName: "Jane",
          lastName: "Smith",
          age: 32,
          dob: "1991-08-22",
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
      setPrescriptions(dummyData);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);

    if (!value) {
      fetchPrescriptions();
      return;
    }

    const [key, order] = value.split("-");
    const sortedPrescriptions = [...prescriptions].sort((a, b) => {
      if (key === "age") {
        const ageA = parseInt(a.age) || 0;
        const ageB = parseInt(b.age) || 0;
        return order === "asc" ? ageA - ageB : ageB - ageA;
      }
      if (key === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (key === "name") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return order === "asc" 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });

    setPrescriptions(sortedPrescriptions);
  };

  const handleGenderChange = (e) => {
    setGenderFilter(e.target.value);
  };

  const filteredPatients = prescriptions.filter(
    (prescription) =>
      (prescription.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (genderFilter ? prescription.gender === genderFilter : true)
  );

  const handleClick = (prescription) => {
    setSelectedPrescription(prescription);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPrescription(null);
  };

  const handleAddNew = () => {
    setSelectedPrescription(null);
    setIsEditing(false);
    setFOpen(true);
  };

  const deleteFromLocalStorage = (id) => {
    try {
      const localPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
      const updatedPrescriptions = localPrescriptions.filter(p => p._id !== id);
      localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
      return true;
    } catch (error) {
      console.error("Error deleting from localStorage:", error);
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) {
      return;
    }

    try {
      // Try backend first
      const response = await fetch(`http://localhost:8081/api/prescriptions/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.warn("Backend delete failed, trying localStorage:", error);
      // Fallback to localStorage
      const success = deleteFromLocalStorage(id);
      if (!success) {
        showSnackbar("Failed to delete prescription", "error");
        return;
      }
    }
    
    // Update UI
    setPrescriptions(prev => prev.filter(p => p._id !== id));
    showSnackbar("Prescription deleted successfully", "success");
    handleClose();
  };

  const handleCloseForm = () => {
    setFOpen(false);
    setSelectedPrescription(null);
    setIsEditing(false);
    fetchPrescriptions(); // Refresh the list
  };

  const handleOpen = () => {
    setFOpen(true);
    setIsEditing(true);
  };

  const handlePrint = async () => {
    if (prescriptionRef.current) {
      try {
        const canvas = await html2canvas(prescriptionRef.current, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 10;
        
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`prescription-${selectedPrescription.firstName}-${selectedPrescription.lastName}.pdf`);
        showSnackbar("PDF generated successfully", "success");
      } catch (error) {
        console.error("Error generating PDF:", error);
        showSnackbar("Failed to generate PDF", "error");
      }
    }
  };

  const exportToExcel = () => {
    try {
      if (filteredPatients.length === 0) {
        showSnackbar("No data to export", "warning");
        return;
      }

      const excelData = filteredPatients.map(prescription => ({
        "First Name": prescription.firstName,
        "Last Name": prescription.lastName,
        "Age": prescription.age,
        "Date of Birth": prescription.dob ? new Date(prescription.dob).toLocaleDateString() : 'N/A',
        "Gender": prescription.gender,
        "Patient Email": prescription.patientEmail,
        "Doctor Email": prescription.email,
        "Prescription Date": prescription.date ? new Date(prescription.date).toLocaleDateString() : 'N/A',
        "Prescription": prescription.rx,
        "Medications Count": prescription.medications?.length || 0
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Prescriptions');
      
      const colWidths = [
        { wch: 12 },
        { wch: 12 },
        { wch: 5 },
        { wch: 12 },
        { wch: 8 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 30 },
        { wch: 10 },
      ];
      ws['!cols'] = colWidths;
      
      XLSX.writeFile(wb, `prescriptions-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      showSnackbar("Excel report exported successfully", "success");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      showSnackbar("Failed to export to Excel", "error");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "100%",
          height: "%100",
          background: "linear-gradient(120deg, #74ebd5, #ACB6E5)",
          backgroundSize: "400% 400%",
          zIndex: -1,
          animation: "gradientBG 15s ease infinite",
        },
      }}
    >
      <Sidebar />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ flexGrow: 1, padding: "20px", position: "relative" }}>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              fullWidth
              displayEmpty
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Sort by</MenuItem>
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
              <MenuItem value="age-asc">Age (Low to High)</MenuItem>
              <MenuItem value="age-desc">Age (High to Low)</MenuItem>
              <MenuItem value="date-asc">Date (Oldest)</MenuItem>
              <MenuItem value="date-desc">Date (Newest)</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={2}>
            <Select
              value={genderFilter}
              onChange={handleGenderChange}
              fullWidth
              displayEmpty
              variant="outlined"
              size="small"
            >
              <MenuItem value="">All Genders</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="contained" 
              color="success" 
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAddNew}
            >
              Add New
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="contained" 
              color="error" 
              fullWidth
              onClick={exportToExcel}
            >
              Export Report
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Total Prescription(s): {filteredPatients.length}
        </Typography>

        {filteredPatients.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No prescriptions found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {searchTerm || genderFilter || sortBy 
                ? "Try adjusting your search filters" 
                : "Start by creating a new prescription"}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{ mt: 2 }}
            >
              Create First Prescription
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredPatients.map((prescription) => (
              <Grid item xs={12} md={6} lg={4} key={prescription._id}>
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    cursor: "pointer",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                  onClick={() => handleClick(prescription)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      color="secondary"
                      fontWeight="bold"
                    >
                      {prescription.firstName} {prescription.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Age:</strong> {prescription.age || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {formatDate(prescription.date)}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      <strong>Email:</strong> {prescription.patientEmail}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {prescription.medications?.slice(0, 2).map((med, index) => (
                        <Chip
                          key={index}
                          label={med.medication}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {prescription.medications?.length > 2 && (
                        <Chip
                          label={`+${prescription.medications.length - 2} more`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                  <ArrowForwardIosIcon color="action" />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Prescription Details Dialog */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Prescription Details
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ py: 2 }}>
            <Box ref={prescriptionRef} sx={{ p: 1 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Patient Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {selectedPrescription?.firstName} {selectedPrescription?.lastName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Age:</strong> {selectedPrescription?.age}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Gender:</strong> {selectedPrescription?.gender}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Date of Birth:</strong> {formatDate(selectedPrescription?.dob)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Patient Email:</strong> {selectedPrescription?.patientEmail}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Prescription Date:</strong> {formatDate(selectedPrescription?.date)}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom color="primary">
                Prescription Details
              </Typography>
              <Box sx={{ 
                backgroundColor: 'grey.50', 
                p: 2, 
                borderRadius: 1,
                mb: 2
              }}>
                <Typography variant="body1">
                  {selectedPrescription?.rx || "No prescription notes available"}
                </Typography>
              </Box>

              {selectedPrescription?.medications?.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom color="primary">
                    Medications
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedPrescription.medications.map((med, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          border: '1px solid',
                          borderColor: 'grey.300',
                          borderRadius: 1,
                          p: 1,
                          mb: 1
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {med.medication}
                        </Typography>
                        <Typography variant="body2">
                          Dosage: {med.dosage} | Frequency: {med.frequency} | Duration: {med.duration}
                        </Typography>
                        {med.notes && (
                          <Typography variant="body2" color="textSecondary">
                            Notes: {med.notes}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: 1, p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => selectedPrescription && handleDelete(selectedPrescription._id)}
            >
              Delete
            </Button>
            <Button 
              variant="contained" 
              color="success"
              onClick={handlePrint}
            >
              Print PDF
            </Button>
          </DialogActions>
        </Dialog>

        {/* Prescription Form Dialog */}
        <Dialog 
          open={fopen} 
          onClose={handleCloseForm} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: 'secondary.main',
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {isEditing ? "Edit Prescription" : "Add New Prescription"}
            </Typography>
            <IconButton onClick={handleCloseForm} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ py: 2, maxHeight: '80vh', overflow: 'auto' }}>
            <PrescriptionForm
              selectedPrescription={selectedPrescription}
              patientMail={selectedPrescription?.patientEmail}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </Box>

      <style jsx>{`
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Box>
  );
};

export default Prescriptions;