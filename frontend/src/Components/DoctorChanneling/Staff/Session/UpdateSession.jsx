import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import StafNav from "../StafNav";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

function UpdateSession() {
  const [inputs, setInputs] = useState({ timeslots: [] }); // Initialize timeslots as an empty array
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/session/${id}`);
        setInputs(response.data.session);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);

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

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/session/${id}`, {
        sectionID: String(inputs.sectionID),
        sessionname: String(inputs.sessionname),
        location: String(inputs.location),
        seatcount: String(inputs.seatcount),
        date: String(inputs.date),
        speciality: String(inputs.speciality),
        doctorname: String(inputs.doctorname),
        price: String(inputs.price),
        timeslots: inputs.timeslots, // Changed to directly pass the array
      })
      .then((res) => res.data);
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
                return { ...slot, starttime: "", endtime: "" }; // Clear invalid times for this slot
              }
    
              // 02. Ensure time gap is less than 6 hours
              const timeDifference = (end - start) / (1000 * 60 * 60); // in hours
              if (timeDifference > 6) {
                window.alert("Time slot difference should not exceed more than 6 hours.");
                return { ...slot, starttime: "", endtime: "" }; // Reset the invalid times
              }
    
              // 03. Ensure end time is after start time
              if (end < start) {
                window.alert("End time cannot be earlier than start time.");
                return { ...slot, starttime: "", endtime: "" }; // Clear invalid times
              }
            }
    
            return updatedSlot; // Return valid updated slot
          }
          return slot; // No change to other slots
        });
    
        setInputs({ ...inputs, timeslots: updatedTimeslots });
      } else {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: value,
        }));
      }
    };
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => {
      window.alert("Updated successfully!");
      history("/stafdash");
    });
  };

  return (
    <div>
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
                <label className="form-label" htmlFor="doctorname">
                  Doctor Name:
                </label>
                <br />
                <input
                  id="doctorname"
                  name="doctorname"
                  type="text"
                  className="form_input_service"
                  value={inputs.doctorname}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="speciality">
                  Doctor Specialization:
                </label>
                <br />
                <input
                  id="speciality"
                  name="speciality"
                  type="text"
                  className="form_input_service"
                  value={inputs.speciality}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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
                  />
                </div>
              ))}

              <button type="submit" className="submit_btn">
                Update Session
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateSession;
