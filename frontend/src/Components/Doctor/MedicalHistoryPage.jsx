import React from "react";
import { Typography, Box, Paper, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const commonData = {
  name: "Sanali R. Sudugodage",
  age: 23,
  dob: "2001/06/03",
  gender: "Female",
  phone: "0770575384",
  allergies: "NKDA",
  medicalHistory: {
    hearingLoss: "Hearing Loss: Gradual onset over the past 3 years",
    tinnitus:
      "Tinnitus: Occasional ringing in the left ear, described as high-pitched and lasting a few seconds",
    noiseExposure:
      "Noise Exposure: History of occupational noise exposure (construction worker for 10 years)",
    medications: "Medications: No current medications",
    familyHistory: "Family History: No family history of hearing loss",
  },
};

const MedicalHistoryPage = ({ patientData, onBack }) => {
  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
      }}
    >
      <IconButton onClick={onBack} sx={{ marginBottom: "10px" }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography
        variant="h5"
        align="center"
        color="secondary"
        sx={{ fontWeight: "bold", marginBottom: "20px" }}
      >
        Medical History
      </Typography>

      <Paper
        elevation={1}
        sx={{
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Name:</strong> {patientData.name}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Age:</strong> {patientData.age}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>DOB:</strong> {patientData.dob}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Gender:</strong> {patientData.gender}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Phone:</strong> {patientData.phone}
        </Typography>
        <Typography variant="body1">
          <strong>Allergies:</strong> {patientData.allergies}
        </Typography>
      </Paper>

      <Paper
        elevation={1}
        sx={{
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          • {commonData.medicalHistory.hearingLoss}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          • {commonData.medicalHistory.tinnitus}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          • {commonData.medicalHistory.noiseExposure}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          • {commonData.medicalHistory.medications}
        </Typography>
        <Typography variant="body1">
          • {commonData.medicalHistory.familyHistory}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MedicalHistoryPage;
