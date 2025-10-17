import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./doctor.css";

function DoctorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials for TELEMEDICINE system only
    const validUsername = "doctor";
    const validPassword = "123";

    if (username === validUsername && password === validPassword) {
      // Create doctor data object
      const doctorData = {
        id: 1,
        firstName: "John",
        lastName: "Smith",
        email: "doctor@hospital.com",
        specialization: "General Medicine",
        phone: "+1234567890"
      };
      
      // Store doctor data in sessionStorage
      sessionStorage.setItem("doctor", JSON.stringify(doctorData));
      
      alert("Telemedicine Login Successful");
      navigate("/DoctorDashboard"); // Use navigate instead of window.location.href
    } else {
      alert("Invalid telemedicine credentials");
    }
  };

  return (
    <div className="telemedicine-login-container">
      <div className="doctor-login-box">
        <div className="login-header">
          <h2>Telemedicine System</h2>
          <h3 className="doctor-login-title">Doctor Login</h3>
        </div>
        <div className="doctor-login-form-container">
          <form className="doctor-login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Doctor ID:
              </label>
              <input
                className="form-input"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your doctor ID"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password:
              </label>
              <input
                className="form-input"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button className="doctor-login-btn" type="submit">
              Login to Telemedicine
            </button>
          </form>
          <p className="system-note">
            Access to Telemedicine Consultation System Only
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;