import { useState, useEffect } from "react";
import axios from "axios";
import StafNav from "../StafNav";

function AddDoctor() {
  const [inputs, setInputs] = useState({
    doctorName: "",
    doctorID: "",
    gender: "",
    gmail: "",
    clinic: "",
    timeSlotStart: "",
    timeSlotEnd: "",
    date: "",
    price: "",
  });

  // eslint-disable-next-line no-unused-vars
  const [clinic, setClinics] = useState([]);
  const [clinicOptions, setClinicOptions] = useState([]);
  const [noClinicMessage, setNoClinicMessage] = useState("");

  const generateDoctorID = () => {
    const prefix = "DOC";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    // Fetch clinic data on component mount
    const fetchClinics = async () => {
      try {
        const response = await axios.get("http://localhost:8081/clinic");
        const clinicData = response.data.clinic;

        if (clinicData.length > 0) {
          setClinics(clinicData);
          setClinicOptions(
            clinicData.map((clinic) => ({
              id: clinic._id, // Use _id or clinicID depending on your model
              name: clinic.clinicname,
            }))
          );
          setNoClinicMessage("");
        } else {
          setNoClinicMessage("No clinic yet available.");
          setClinicOptions([]);
        }
      } catch (error) {
        console.error("Error fetching clinic data:", error);
        setNoClinicMessage("Error fetching clinic data.");
      }
    };

    fetchClinics();
    setInputs((prevInputs) => ({
      ...prevInputs,
      doctorID: generateDoctorID(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startTime = inputs.timeSlotStart;
    const endTime = inputs.timeSlotEnd;

    // Convert the times to Date objects for comparison
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    // Validate time slots
    if (start >= end) {
      window.alert("End time must be after the start time.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/doctor/check-session",
        {
          doctorName: inputs.doctorName,
          date: inputs.date,
          timeSlotStart: inputs.timeSlotStart,
          timeSlotEnd: inputs.timeSlotEnd,
        }
      );

      if (response.data.exists) {
        window.alert("Session already exists.");
        return; // Stop form submission if session exists
      }

      // If no duplicate session exists, proceed to submit the form
      await sendRequest();
      window.alert("Doctor added successfully!");
      window.location.href = "/dochome";
    } catch (error) {
      console.error("Error checking session:", error);
      window.alert("Error occurred while checking session.");
    }
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/doctor", {
      doctorName: inputs.doctorName,
      doctorID: inputs.doctorID,
      gender: inputs.gender,
      gmail: inputs.gmail,
      clinic: inputs.clinic,
      timeSlotStart: inputs.timeSlotStart,
      timeSlotEnd: inputs.timeSlotEnd,
      date: inputs.date,
      price: inputs.price,
    });
  };

  return (
    <div>
      <div className="dental_from_background">
        <StafNav />
        <div className="form_full_dental">
          <div className="appointment_from_full">
            <h1 className="form_head_dental">Add New Doctor </h1>
            <form className="appointment-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="doctorID">
                  Doctor ID:
                </label>
                <br />
                <input
                  type="text"
                  id="doctorID"
                  name="doctorID"
                  className="form_input_service"
                  value={inputs.doctorID}
                  readOnly
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="doctorName">
                  Doctor Name:
                </label>
                <br />
                <input
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  className="form_input_service"
                  value={inputs.doctorName}
                  onChange={(e) => {
                    const re = /^[A-Za-z\s]*$/;
                    if (re.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gender">
                  Gender:
                </label>
                <br />
                <select
                  id="gender"
                  name="gender"
                  className="form_input_service"
                  value={inputs.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="gmail">
                  Gmail:
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
              <div className="form-group">
                <label className="form-label" htmlFor="clinic">
                  Clinic:
                </label>
                <br />
                {noClinicMessage ? (
                  <p>{noClinicMessage}</p>
                ) : (
                  <select
                    id="clinic"
                    name="clinic"
                    className="form_input_service"
                    value={inputs.clinic}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Clinic</option>
                    {clinicOptions.map((clinic) => (
                      <option key={clinic.id} value={clinic.clinicname}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="timeSlot">
                  Add Time Slot:
                </label>
                <br />
                <input
                  type="time"
                  id="timeSlotStart"
                  name="timeSlotStart"
                  className="newinputfromneww"
                  value={inputs.timeSlotStart}
                  onChange={handleChange}
                  required
                />
                &nbsp; &nbsp;
                <label className="form-label" htmlFor="timeSlot">
                  -
                </label>
                &nbsp; &nbsp;
                <input
                  type="time"
                  id="timeSlotEnd"
                  name="timeSlotEnd"
                  className="newinputfromneww"
                  value={inputs.timeSlotEnd}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form_group_newdent">
                <div className="form-group">
                  <label className="form-label" htmlFor="date">
                    Date:
                  </label>
                  <br />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="newinputfromneww"
                    value={inputs.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="price">
                    Charges (Rs.):
                  </label>
                  <br />
                  <input 
  type="text"
  id="price"
  name="price"
  className="newinputfromneww"
  value={inputs.price}
  onChange={(e) => {
    const re = /^[0-9\b]+$/; // Allow numbers and backspace
    if (e.target.value === "" || re.test(e.target.value)) {
      handleChange(e); // Allow deletion when input is empty
    }
  }}
  required
/>

                </div>
              </div>
              <button type="submit" className="submit_btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDoctor;
