import React, { useState } from "react";
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
  Link,
  Input,
} from "@material-ui/core";
import axios from "axios";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Swal from "sweetalert2";

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

const DoctorSignUp = () => {
  const classes = useStyles();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [sheduleTimes, setSheduleTimes] = useState("");
  const [locations, setLocations] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [imageSelected, setImageSelected] = useState(null);
  const [picture, setPicture] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "ml_default");
    await axios.post(
      "https://api.cloudinary.com/v1_1/dnomnqmne/image/upload",
      formData
    );
    const doctor = {
      firstName,
      lastName,
      dob,
      specialisation,
      sheduleTimes,
      locations,
      email,
      password,
      picture,
    };

    try {
      const response = await axios.post(
        `http://localhost:8081/doctorFunction/register`,
        doctor
      );
      if (response.data.message !== "Email is Already Used") {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then((okay) => {
          if (okay) {
            window.location.href = "/DoctorLogin";
          }
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Email Already Taken",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Registration Not Successful",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const validateForm = () => {
    return (
      validateFirstName() &&
      validateLastName() &&
      validateEmail() &&
      validatePassword() &&
      validateRePassword()
    );
  };

  const validateFirstName = () => {
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName)) {
      setFirstNameError("First Name must contain only letters");
      return false;
    }
    setFirstNameError("");
    return true;
  };

  const validateLastName = () => {
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(lastName)) {
      setLastNameError("Last Name must contain only letters");
      return false;
    }
    setLastNameError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (!/\d/.test(password)) {
      setPasswordError("Password must contain at least one digit");
      return false;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setPasswordError("Password must contain at least one letter");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateRePassword = () => {
    if (password !== rePassword) {
      setRePasswordError("Passwords do not match");
      return false;
    }
    setRePasswordError("");
    return true;
  };

  const handleImageChange = (event) => {
    setImageSelected(event.target.files[0]);
    setPicture(
      "https://res.cloudinary.com/dnomnqmne/image/upload/v1630743483/" +
        event.target.files[0].name
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon style={{ fontSize: 40 }} />
        </Avatar>
        <br />
        <Typography component="h1" variant="h5">
          Doctor Sign Up
        </Typography>
        <br />
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
                    error={!!firstNameError}
                    helperText={firstNameError}
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
                    error={!!lastNameError}
                    helperText={lastNameError}
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
                    autoComplete="sheduleTimes"
                    type="time"
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
                    autoComplete="locations"
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
                    error={!!emailError}
                    helperText={emailError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="rePassword"
                    label="Re-enter Password"
                    type="password"
                    id="rePassword"
                    autoComplete="new-password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    error={!!rePasswordError}
                    helperText={rePasswordError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginTop: "1rem" }}
                    required
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
                Sign Up
              </Button>
            </form>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              mt={5}
            >
              {"Already have an account? "}
              <Link href="DoctorLogin" variant="body2">
                Sign In
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default DoctorSignUp;
