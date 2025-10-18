import React, { useState, useEffect } from "react";
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
import MedicalHistoryPage from "./MedicalHistoryPage";
import PrescriptionForm from "./PrescriptionForm";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(``);
  const [open, setOpen] = useState(false);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [fopen, setFOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchedPatients = [
      {
        id: 0,
        name: "Mr John Doe",
        time: "10:00-11:00 AM",
        date: "08/07/2024",
        location: "Galle",
        age: 23,
        dob: "2001/06/03",
        gender: "Female",
        phone: "0770575384",
        allergies: "NKDA",
        email: `primedhavi@gmail.com`,
      },
      {
        id: 1,
        name: "Mrs Jane Doe",
        time: "11:00-12:00 AM",
        date: "08/07/2024",
        location: "Colombo",
        age: 23,
        dob: "2001/06/03",
        gender: "Female",
        phone: "0770575384",
        allergies: "NKDA",
        email: `primedhavi@gmail.com`,
      },
      {
        id: 2,
        name: "Mr John Smith",
        time: "12:00-01:00 PM",
        date: "08/07/2024",
        location: "Galle",
        age: 23,
        dob: "2001/06/03",
        gender: "Female",
        phone: "0770575384",
        allergies: "NKDA",
        email: `primedhavi@gmail.com`,
      },
    ];
    setPatients(fetchedPatients);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    const [key, order] = e.target.value.split("-");
    setSortBy(e.target.value);

    const sortedPatients = [...patients].sort((a, b) => {
      if (key === "time") {
        const timeA = new Date(`1970/01/01 ${a.time.split("-")[0]}`);
        const timeB = new Date(`1970/01/01 ${b.time.split("-")[0]}`);
        return order === "asc" ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });

    setPatients(sortedPatients);
  };

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter ? patient.location === locationFilter : true)
  );

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    sessionStorage.setItem("patient", JSON.stringify(patient));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(``);
  };

  const handleViewMedicalHistory = () => {
    setOpen(false);
    setShowMedicalHistory(true);
  };

  const handleBackToPatients = () => {
    setShowMedicalHistory(false);
    setSelectedPatient(``);
  };

  const handleCloseForm = () => {
    setFOpen(false);
    setIsEditing(false);
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
        {!showMedicalHistory ? (
          <>
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
                  <MenuItem value="time-asc">Time (Ascending)</MenuItem>
                  <MenuItem value="time-desc">Time (Descending)</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} md={3}>
                <Select
                  value={locationFilter}
                  onChange={handleLocationChange}
                  fullWidth
                  displayEmpty
                  variant="outlined"
                >
                  <MenuItem value="">ALL</MenuItem>
                  <MenuItem value="Colombo">Colombo</MenuItem>
                  <MenuItem value="Galle">Galle</MenuItem>
                  {/* Add more locations as needed */}
                </Select>
              </Grid>
            </Grid>

            <Typography variant="h6" style={{ marginTop: "20px" }}>
              Total Patient(s): {filteredPatients.length}
            </Typography>

            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              {filteredPatients.map((patient) => (
                <Grid item xs={12} md={6} key={patient.id}>
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
                    onClick={() => handlePatientClick(patient)}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        color="secondary"
                        fontWeight="bold"
                      >
                        {patient.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {patient.email}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Time: {patient.time} Date: {patient.date}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Location: {patient.location}
                      </Typography>
                    </CardContent>
                    <ArrowForwardIosIcon />
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Modal for Patient Details */}
            {selectedPatient && (
              <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>
                  <Typography
                    variant="h6"
                    align="center"
                    color="secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Patient Report
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
                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    <strong>Name:</strong> {selectedPatient.name}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    <strong>Email:</strong> {selectedPatient.email}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    <strong>Time:</strong> {selectedPatient.time}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    <strong>Date:</strong> {selectedPatient.date}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Location:</strong> {selectedPatient.location}
                  </Typography>
                </DialogContent>
                <DialogActions
                  sx={{ justifyContent: "center", paddingBottom: "20px" }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleViewMedicalHistory}
                  >
                    Medical History
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setFOpen(true)}
                  >
                    Prescribe
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </>
        ) : (
          <MedicalHistoryPage
            patientData={selectedPatient}
            onBack={handleBackToPatients}
          />
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
            <PrescriptionForm patientMail={selectedPatient.email} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PatientsPage;

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
