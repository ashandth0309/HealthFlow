import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "../Doctor/SideBar";
import { useNavigate } from "react-router-dom";

const DoctorProfilePage = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const doctor = JSON.parse(sessionStorage.getItem("doctor"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/doctorFunction/get/${doctor._id}`
        );
        setDoctorData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctor._id]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setOpenDeleteDialog(false);
    axios
      .delete(`http://localhost:8081/doctorFunction/delete/${doctor._id}`)
      .then((response) => {
        if (response.data.message === "Doctor deleted successfully") {
          window.location.href = "/DoctorLogin";
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        animation: "fadeIn 1.5s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Animation */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          background: "linear-gradient(120deg, #74ebd5, #ACB6E5)",
          backgroundSize: "400% 400%",
          animation: "gradientBG 15s ease infinite",
        }}
      />

      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          padding: "20px",
          maxWidth: "600px",
          margin: "auto",
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
          animation: "slideInUp 1s ease-out",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          color="primary"
          sx={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Doctor Profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            animation: "bounceIn 1s",
          }}
        >
          <Avatar
            alt={`${doctorData.firstName} ${doctorData.lastName}`}
            src={doctorData.picture || "/default-profile.png"}
            sx={{
              width: 150,
              height: 150,
              border: "3px solid #ecf0f1",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          />
        </Box>

        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "30px",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography
            variant="body1"
            sx={{ marginBottom: "10px", fontSize: "1.2rem" }}
          >
            <strong>Name:</strong> {doctorData.firstName} {doctorData.lastName}
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "10px", fontSize: "1.2rem" }}
          >
            <strong>Specialization:</strong> {doctorData.specialisation}
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "10px", fontSize: "1.2rem" }}
          >
            <strong>Email:</strong> {doctorData.email}
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "10px", fontSize: "1.2rem" }}
          >
            <strong>Location:</strong> {doctorData.locations}
          </Typography>
        </Paper>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            sx={{
              borderRadius: "10px",
              padding: "10px 30px",
              fontSize: "1rem",
              transition: "all 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: "#388e3c",
              },
            }}
            onClick={() => navigate("/DoctorEdit")}
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              borderRadius: "10px",
              padding: "10px 30px",
              fontSize: "1rem",
              transition: "all 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: "#d32f2f",
              },
            }}
            onClick={handleDeleteClick}
          >
            Delete Account
          </Button>
        </Box>

        {/* Delete Account Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          maxWidth="xs"
          fullWidth
          sx={{
            animation: "zoomIn 0.5s",
          }}
        >
          <DialogTitle>
            <Typography
              variant="h6"
              align="center"
              color="secondary"
              sx={{ fontWeight: "bold" }}
            >
              Confirm Deletion
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" sx={{ fontSize: "1rem" }}>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDeleteCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

// Add the background gradient animation in the global CSS
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

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideInUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes bounceIn {
    0%,
    20%,
    40%,
    60%,
    80%,
    100% {
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    0% {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
    }
    20% {
        transform: scale3d(1.1, 1.1, 1.1);
    }
    40% {
        transform: scale3d(0.9, 0.9, 0.9);
    }
    60% {
        opacity: 1;
        transform: scale3d(1.03, 1.03, 1.03);
    }
    80% {
        transform: scale3d(0.97, 0.97, 0.97);
    }
    100% {
        opacity: 1;
        transform: scale3d(1, 1, 1);
    }
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
    }
    50% {
        opacity: 1;
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

export default DoctorProfilePage;
