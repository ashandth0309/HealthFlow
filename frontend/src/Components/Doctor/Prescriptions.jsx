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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
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
  const [selectedPrescription, setSelectedPrescription] = useState(``);
  const [open, setOpen] = useState(false);
  const [fopen, setFOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const doctor = JSON.parse(sessionStorage.getItem("doctor"));
  const prescriptionRef = useRef(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/prescriptions/prescriptions"
      );
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    const [key, order] = e.target.value.split("-");
    setSortBy(e.target.value);

    const sortedPrescriptions = [...prescriptions].sort((a, b) => {
      if (key === "age") {
        return order === "asc" ? a.age - b.age : b.age - a.age;
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
      prescription.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (genderFilter ? prescription.gender === genderFilter : true) &&
      prescription.email === doctor.email
  );

  const handleClick = (prescription) => {
    setSelectedPrescription(prescription);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPrescription(``);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8081/prescriptions/prescriptions/${id}`, {
        method: "DELETE",
      });
      fetchPrescriptions();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseForm = () => {
    setFOpen(false);
    setSelectedPrescription(``);
    setIsEditing(false);
  };

  const handleOpen = () => {
    setFOpen(true);
    setIsEditing(true);
  };

  const handlePrint = async () => {
    if (prescriptionRef.current) {
      const canvas = await html2canvas(prescriptionRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 200, 100);
      pdf.save("prescription.pdf");
    }
  };

   const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredPatients);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'report.xlsx');
    };
    

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background animation */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "linear-gradient(120deg, #74ebd5, #ACB6E5)",
          backgroundSize: "400% 400%",
          zIndex: -1,
          animation: "gradientBG 15s ease infinite",
        }}
      />

      <Sidebar />
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search"
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
          <Grid item xs={12} md={3}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              fullWidth
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Sort by:
              </MenuItem>
              <MenuItem value="age-asc">Age (Ascending)</MenuItem>
              <MenuItem value="age-desc">Age (Descending)</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              value={genderFilter}
              onChange={handleGenderChange}
              fullWidth
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="">ALL</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </Grid>
        </Grid>
          <Button style={{color:'white', backgroundColor:'red', marginTop:'5px'}}  color="error" onClick={()=>exportToExcel()}>Report</Button>
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Total Prescription(s): {filteredPatients.length}
        </Typography>

        <Grid container spacing={2} style={{ marginTop: "20px" }}>
          {filteredPatients.map((prescription) => (
            <Grid item xs={12} md={6} key={prescription._id}>
              <Card
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  cursor: "pointer",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
                onClick={() => handleClick(prescription)}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    color="secondary"
                    fontWeight="bold"
                  >
                    {prescription.firstName} {prescription.lastName}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Age: {prescription.age}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Date: {prescription.date}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Mail: {prescription.patientEmail}
                  </Typography>
                </CardContent>
                <ArrowForwardIosIcon />
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedPrescription && (
          <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>
              <Typography
                variant="h6"
                align="center"
                color="secondary"
                sx={{ fontWeight: "bold" }}
              >
                Prescription Report
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{ position: "absolute", top: 8, left: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <div ref={prescriptionRef}>
                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>Name:</strong> {selectedPrescription.firstName}{" "}
                  {selectedPrescription.lastName}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>Age:</strong> {selectedPrescription.age}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>Date:</strong> {selectedPrescription.date}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>Email:</strong> {selectedPrescription.patientEmail}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>Dr Email:</strong> {selectedPrescription.email}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>Prescription:</strong> {selectedPrescription.rx}
                </Typography>
              </div>
            </DialogContent>
            <DialogActions
              sx={{ justifyContent: "center", paddingBottom: "20px" }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                onClick={() => handleDelete(selectedPrescription._id)}
              >
                Delete
              </Button>
              <Button variant="contained" color="error" onClick={handlePrint}>
                Print
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Dialog open={fopen} onClose={handleCloseForm} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography
              variant="h6"
              align="center"
              color="secondary"
              sx={{ fontWeight: "bold" }}
            >
              {isEditing ? "Edit Prescription" : "Add New Prescription"}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseForm}
              sx={{ position: "absolute", top: 8, left: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <PrescriptionForm
              selectedPrescription={selectedPrescription}
              patientMail={selectedPrescription.patientEmail}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Prescriptions;

// Add the background gradient animation
const styles = `
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

body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
}
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);
