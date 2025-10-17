import { useState, useEffect } from "react";
import axios from "axios";
import StafNav from "../StafNav.jsx";
import "../StafNav.jsx";
import "../../Home/Home.css";
import "../staff.css";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
function AddSession() {
  const [inputs, setInputs] = useState({
    sectionID: "",
    sessionname: "",
    location: "",
    seatcount: "",
    date: "",
    speciality: "",
    doctorname: "",
    price: "",
    timeslots: [{ starttime: "", endtime: "" }],
  });

  const generatesectionID = () => {
    const prefix = "SID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      sectionID: generatesectionID(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const { dataset } = e.target;

    if (dataset.idx !== undefined) {
      const idx = dataset.idx;
      const updatedTimeslots = inputs.timeslots.map((slot, index) => {
        if (index === parseInt(idx)) {
          const updatedSlot = { ...slot, [name]: value };

          // Validate start time and end time difference
          if (updatedSlot.starttime && updatedSlot.endtime) {
            const start = new Date(`1970-01-01T${updatedSlot.starttime}:00`);
            const end = new Date(`1970-01-01T${updatedSlot.endtime}:00`);

            // 01. Prevent same start and end time
            if (start.getTime() === end.getTime()) {
              window.alert("Start time and end time cannot be the same.");
              return { starttime: "", endtime: "" }; // Clear invalid times
            }

            // 02. Ensure time gap is less than 6 hours
            const timeDifference = (end - start) / (1000 * 60 * 60); // in hours
            if (timeDifference > 6) {
              window.alert(
                "Time slot difference should not exceed more than 6 hours."
              );
              return { starttime: "", endtime: "" }; // Reset the invalid times
            }

            // 03. Ensure end time is after start time
            if (end < start) {
              window.alert("End time cannot be earlier than start time.");
              return { starttime: "", endtime: "" }; // Clear invalid times
            }
          }

          return updatedSlot;
        }
        return slot;
      });

      setInputs({ ...inputs, timeslots: updatedTimeslots });
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
    }
  };
  if (name === "price") {
    const numericRegex = /^[0-9]*$/; // Only allow whole numbers, block decimal points
    if (!numericRegex.test(value) || value.includes('.')) {
      return; // Exit if input contains non-numeric characters or a decimal point
    }
  }
  // const calculateTimeDifference = (starttime, endtime, idx) => {
  //   const start = new Date(`1970-01-01T${starttime}:00`);
  //   const end = new Date(`1970-01-01T${endtime}:00`);

  //   // Check if start time is the same as end time
  //   if (start.getTime() === end.getTime()) {
  //     window.alert("Start time and end time cannot be the same.");

  //     // Clear the starttime and endtime fields for this specific time slot
  //     setInputs((prevInputs) => {
  //       const updatedTimeslots = [...prevInputs.timeslots];
  //       updatedTimeslots[idx] = { starttime: "", endtime: "" }; // Clear the times

  //       return {
  //         ...prevInputs,
  //         timeslots: updatedTimeslots,
  //       };
  //     });

  //     return 0; // Return 0 or an invalid indicator
  //   }

  //   const differenceInHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
  //   return differenceInHours;
  // };

  const addTimeSlot = () => {
    if (inputs.timeslots.length < 3) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        timeslots: [...prevInputs.timeslots, { starttime: "", endtime: "" }],
      }));
    }
  };

  const removeTimeSlot = (index) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      timeslots: prevInputs.timeslots.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if session with the same date, doctorname, and location already exists
    const isSessionExist = await checkIfSessionExists();

    if (isSessionExist) {
      window.alert(
        "This session already exists. Please enter different details."
      );
      return; // Prevent form submission if session exists
    }

    console.log(inputs);
    await sendRequest();
    window.alert("Session Added successfully!");
    window.location.href = "./stafdash";
  };

  const checkIfSessionExists = async () => {
    try {
      const { date, doctorname, location } = inputs;

      // Make a request to the backend to check for existing session
      const response = await axios.post(
        "http://localhost:8081/session/check-session",
        {
          date,
          doctorname,
          location,
        }
      );

      // Assuming the backend responds with a boolean indicating if the session exists
      return response.data.exists; // If true, the session exists
    } catch (error) {
      console.error("Error checking session existence:", error);
      return false; // Return false in case of an error
    }
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/session", inputs);
  };

  return (
    <div className="doctor_home_bk">
      <StafNav />
      <div className="form_full_doctor_code">
        <div className="doctor_from_full">
          <h1 className="form_head_doctor">Add New Session </h1>
          <form className="doctor-form" onSubmit={handleSubmit}>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="sectionID">
                  Session ID:
                </label>
                <br />
                <input
                  type="text"
                  id="sectionID"
                  name="sectionID"
                  className="form-input"
                  value={inputs.sectionID}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Session Name:</label>
                <br />
                <input
                  type="text"
                  id="sessionname"
                  name="sessionname"
                  className="form-input"
                  value={inputs.sessionname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Doctor Name:
              </label>
              <br />
              <input
                id="doctorname"
                name="doctorname"
                type="text"
                className="form_input_service"
                value={inputs.doctorname}
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
              <label className="form-label" htmlFor="location">
                Doctor Specialization:
              </label>
              <br />
              <input
                id="speciality"
                name="speciality"
                type="text"
                className="form_input_service"
                value={inputs.speciality}
                onChange={(e) => {
                  const re = /^[A-Za-z\s]*$/;
                  if (re.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
                required
              />
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Location:
                </label>
                <br />
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-input"
                  value={inputs.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  Charges (Rs):
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
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="seatcount">
                  Seat Count:
                </label>
                <br />
                <input
                  type="number"
                  id="seatcount"
                  name="seatcount"
                  className="form-input"
                  value={inputs.seatcount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="date">
                  Date:
                </label>
                <br />
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={inputs.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="input_group adbtn">
              <label className="form-label">Add Time Slot</label>
              {inputs.timeslots.length < 3 && (
                <IoMdAdd className="actionaddbtn" onClick={addTimeSlot} />
              )}
            </div>
            {inputs.timeslots.map((slot, idx) => (
              <div className="input_group_date" key={idx}>
                <div className="form-group">
                  <label className="form-label">Start Time:</label>
                  <br />
                  <input
                    type="time"
                    name="starttime"
                    className="form_input_time"
                    value={slot.starttime}
                    data-idx={idx}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time:</label>
                  <br />
                  <input
                    type="time"
                    name="endtime"
                    className="form_input_time"
                    value={slot.endtime}
                    data-idx={idx}
                    onChange={handleChange}
                    required
                  />
                </div>
                <MdDelete
                  className="actiondltbtn"
                  onClick={() => removeTimeSlot(idx)}
                  c
                />
              </div>
            ))}

            <button type="submit" className="submit_btn">
              Add Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSession;
