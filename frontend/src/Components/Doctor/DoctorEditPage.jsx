import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  card: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const DoctorEditPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [doctorData, setDoctorData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [sheduleTimes, setSheduleTimes] = useState("");
  const [locations, setLocations] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState({});

  const doctor = JSON.parse(sessionStorage.getItem("doctor"));

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/doctorFunction/get/${doctor._id}`
        );
        const data = response.data;
        setDoctorData(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setDob(data.dob);
        setSpecialisation(data.specialisation);
        setSheduleTimes(data.sheduleTimes);
        setLocations(data.locations);
        setEmail(data.email);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (doctor) {
      fetchDoctorData();
    } else {
      setLoading(false);
    }
  }, [doctor._id]);

  const validateForm = () => {
    const errors = {};

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName)) {
      errors.firstName = "First Name must contain only letters";
    }
    if (!nameRegex.test(lastName)) {
      errors.lastName = "Last Name must contain only letters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }

    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const updatedDoctor = {
      firstName,
      lastName,
      dob,
      specialisation,
      sheduleTimes,
      locations,
      email,
    };

    try {
      const response = await axios.put(
        `http://localhost:8081/doctorFunction/update/${doctor._id}`,
        updatedDoctor
      );
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        sessionStorage.setItem("doctor", JSON.stringify(response.data.doctor));
        navigate("/DoctorProfilePage");
      });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Profile update failed",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon style={{ fontSize: 40 }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Edit Profile
        </Typography>
        <Card className={classes.card}>
          <CardContent>
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={!!validationError.firstName}
                    helperText={validationError.firstName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={!!validationError.lastName}
                    helperText={validationError.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="dob"
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="specialisation"
                    label="Specialisation"
                    name="specialisation"
                    autoComplete="specialisation"
                    value={specialisation}
                    onChange={(e) => setSpecialisation(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="sheduleTimes"
                    label="Schedule Times"
                    name="sheduleTimes"
                    value={sheduleTimes}
                    onChange={(e) => setSheduleTimes(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="locations"
                    label="Locations"
                    name="locations"
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!validationError.email}
                    helperText={validationError.email}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Update Profile
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => navigate("/DoctorProfilePage")}
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default DoctorEditPage;
