import { useState, useEffect } from "react";
import axios from "axios";
import HomeNav from "../Home/HomeNav.jsx";

function AddAppointment() {
  const [inputs, setInputs] = useState({
    fullname: "",
    doctorAppoimentID: "",
    phone: "",
    gmail: "",
    date: "",
    session: "",
    timeSlot: "",
    price: "",
    doctorname: "", // Add doctorname to state
    location: "", // Add location to state
  });

  // Generate a unique appointment ID
  const generateAppoimentID = () => {
    const prefix = "APID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  // Fetch data from local storage and update state
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("sessionDetails"));

    if (storedData) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        doctorAppoimentID: generateAppoimentID(), // Generate a new ID on form load
        date: storedData.date || "",
        session: storedData.session || "",
        price: storedData.price || "",
        timeSlot: storedData.timeSlot || "",
        doctorname: storedData.doctorname || "", // Set doctorname from storage
        location: storedData.location || "", // Set location from storage
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  // Check if the pressed key is a numeric character
  const handleKeyDown = (e) => {
    if (
      (e.key >= "0" && e.key <= "9") ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      e.preventDefault(); // Prevent input if it's a number
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear local storage before sending the request
    localStorage.removeItem("appointmentDetails");

    try {
      await sendRequest(); // Assuming sendRequest() handles API request to save appointment
      // Save the inputs to local storage after successful submission
      localStorage.setItem("appointmentDetails", JSON.stringify(inputs));

      window.alert("Appointment Added successfully!");
      window.location.href = "./myAppoimentSummry"; // Redirect to appointments page
    } catch (error) {
      console.error("Error adding appointment:", error);
      window.alert("Failed to add appointment. Please try again.");
    }
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/doctorAppointment", {
      fullname: inputs.fullname,
      doctorAppoimentID: inputs.doctorAppoimentID,
      phone: inputs.phone,
      gmail: inputs.gmail,
      date: inputs.date,
      session: inputs.session,
      price: inputs.price,
      timeSlot: inputs.timeSlot,
      doctorname: inputs.doctorname, // Include doctorname in request
      location: inputs.location, // Include location in request
    });
  };

  return (
    <div className="doctor_home_bk">
      <HomeNav />
      <div className="form_full_doctor_code">
        <div className="doctor_from_full">
          <h1 className="form_head_doctor">Book Appointment</h1>
          <form className="doctor-form" onSubmit={handleSubmit}>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="clinicname">
                  Appointment ID:
                </label>
                <br />
                <input
                  type="text"
                  id="doctorAppoimentID"
                  name="doctorAppoimentID"
                  className="form-input"
                  value={inputs.doctorAppoimentID}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="session">
                  Session:
                </label>
                <br />
                <input
                  type="text"
                  id="session"
                  name="session"
                  className="form-input"
                  value={inputs.session}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="doctorname">
                  Doctor Name:
                </label>
                <br />
                <input
                  type="text"
                  id="doctorname"
                  name="doctorname"
                  className="form-input"
                  value={inputs.doctorname} // Show doctor name
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Location:
                </label>
                <br />
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-input"
                  value={inputs.location} // Show location
                  readOnly
                />
              </div>
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="date">
                  Date
                </label>
                <br />
                <input
                  type="text"
                  id="date"
                  name="date"
                  className="form-input"
                  value={inputs.date}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="timeSlot">
                  Time:
                </label>
                <br />
                <input
                  type="text"
                  id="timeSlot"
                  name="timeSlot"
                  className="form-input"
                  value={inputs.timeSlot}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Charges (Rs):</label>
              <br />
              <input
                type="text"
                id="price"
                readOnly
                name="price"
                className="form_input_service"
                value={inputs.price}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full name:</label>
              <br />
              <input
                type="text"
                id="fullname"
                name="fullname"
                className="form_input_service"
                value={inputs.fullname}
                onChange={(e) => {
                  const re = /^[A-Za-z\s]*$/;
                  if (re.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
                onKeyDown={handleKeyDown}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone:
              </label>
              <br />
              <input
                type="text"
                id="phone"
                name="phone"
                className="form_input_service"
                value={inputs.phone}
                onChange={(e) => {
                  const re = /^[0-9\b]{0,10}$/;
                  if (re.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
                maxLength="10"
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits."
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gmail">
                Email:
              </label>
              <br />
              <input
                type="email"
                id="gmail"
                name="gmail"
                className="form_input_service"
                value={inputs.gmail}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit_btn">
              Add Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAppointment;
