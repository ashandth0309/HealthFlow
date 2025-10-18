import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";

const PrescriptionForm = ({ selectedPrescription, patientMail }) => {
  const doctor = JSON.parse(sessionStorage.getItem("doctor"));
  const initialFormValues = selectedPrescription
    ? {
        firstName: selectedPrescription.firstName,
        lastName: selectedPrescription.lastName,
        age: selectedPrescription.age,
        dob: new Date(selectedPrescription.dob),
        gender: selectedPrescription.gender,
        email: doctor.email,
        rx: selectedPrescription.rx,
        date: new Date(selectedPrescription.date),
        patientEmail: patientMail,
      }
    : {
        firstName: "",
        lastName: "",
        age: "",
        dob: null,
        gender: "",
        email: doctor.email,
        rx: "",
        date: null,
        patientEmail: patientMail,
      };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormValues(initialFormValues);
  }, [selectedPrescription]);

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

    // First Name Validation
    tempErrors.firstName = formValues.firstName
      ? nameRegex.test(formValues.firstName)
        ? ""
        : "First Name must contain only letters."
      : "First Name is required.";

    // Last Name Validation
    tempErrors.lastName = formValues.lastName
      ? nameRegex.test(formValues.lastName)
        ? ""
        : "Last Name must contain only letters."
      : "Last Name is required.";

    // Age Validation
    tempErrors.age =
      formValues.age && formValues.age > 0 ? "" : "Valid age is required.";

    // DOB Validation
    tempErrors.dob = formValues.dob ? "" : "Date of Birth is required.";

    // Gender Validation
    tempErrors.gender = formValues.gender ? "" : "Gender is required.";

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    tempErrors.email = formValues.email
      ? emailRegex.test(formValues.email)
        ? ""
        : "Email is not valid."
      : "Email is required.";

    // Prescription (Rx) Validation
    tempErrors.rx = formValues.rx ? "" : "Prescription (Rx) is required.";

    // Date Validation
    tempErrors.date = formValues.date ? "" : "Date is required.";

    setErrors(tempErrors);

    // Returns true if no errors
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleClear = () => {
    setFormValues(initialFormValues);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const url = selectedPrescription
          ? `http://localhost:8081/prescriptions/prescriptions/${selectedPrescription._id}`
          : "http://localhost:8081/prescriptions/prescriptions";
        const method = selectedPrescription ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });

        const result = await response.json();
        if (response.status === 201 || response.status === 200) {
          await axios.post(`http://localhost:8081/prescriptions/mailSend`, {
            email: patientMail,
            rx: formValues.rx,
          });
        }

        if (selectedPrescription) {
          window.location.href = "/Prescriptions";
        } else {
          window.location.href = "/PatientsPage";
        }

        if (response.ok) {
          await Swal.fire({
            title: "Success!",
            text: `Prescription successfully ${
              selectedPrescription ? "updated" : "submitted"
            }.`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          throw new Error(result.message || "An error occurred");
        }
      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text:
            error.message ||
            "An error occurred while submitting the prescription.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

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
      <Typography
        variant="h5"
        align="center"
        color="secondary"
        sx={{ fontWeight: "bold", marginBottom: "20px" }}
      >
        {selectedPrescription ? "Edit Prescription" : "New Prescription"}
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
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <div></div>
            <Button
              variant="contained"
              color="error"
              onClick={handleClear}
              sx={{ height: "50px" }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ height: "50px" }}
            >
              {selectedPrescription ? "Update" : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PrescriptionForm;
