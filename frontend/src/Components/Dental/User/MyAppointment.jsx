import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./DentalUser.css";
import DentalNav from "../Home/DentalNav";
import NotFound from "./img/nofound.png";
const URL = "http://localhost:8081/appointment";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function MyAppointment() {
  const [dental, setDental] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleViewAppointment = () => {
    if (email === "") {
      setMessage("Please enter an email.");
      return;
    }

    fetchHandler()
      .then((data) => {
        const filteredData = data.dental.filter((item) => item.email === email);

        if (filteredData.length > 0) {
          setDental(filteredData);
          setMessage(""); // Clear any previous messages
        } else {
          setDental([]); // Clear table if no data found
          setMessage("No appointments found for this email.");
        }
      })
      .catch((error) => {
        setMessage("Error fetching data. Please try again.");
        console.error(error);
      });
  };

  //Delete Function
  const history = useNavigate();
  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to Cancel this appointments?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`); // Correct URL construction
        window.alert("appointments Cancel successfully!");
        history("/myAppointment");
        window.location.reload(); // Reload the page
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error Cancel details:", error);
      }
    }
  };
  return (
    <div className="dental_form_background_app">
      <div>
        <DentalNav />
        <div className="check_gmail_box_dental">
          <div className="dental_gmail_box">
            <label className="form_label_gmail" htmlFor="fullname">
              Enter Your Gmail
            </label>
            <br />
            <input
              type="email"
              value={email}
              className="gmail_insert"
              onChange={handleEmailChange}
            />
            <button
              onClick={handleViewAppointment}
              className="submit_btn_gmail"
            >
              View My Appointment
            </button>
          </div>
        </div>

        {message && (
          <div className="not_found_box">
            <img src={NotFound} alt="noimg" className="notfound" />
            <p className="nodata_pera">No Details Found</p>
          </div>
        )}
        <div className="card_main_dental">
          {dental.length > 0 && (
            <div className="all_box_app_dental">
              <h2 className="card_title_dental">My Appointments</h2>
              <br />
              <div className="dental_card_container">
                {dental.map((item, index) => (
                  <div className="dental_card" key={index}>
                    <div className="dental_card_header">
                      <h3 className="dental_card_title">
                        Appointment ID: {item.appointmentID}
                      </h3>
                    </div>
                   
                    <div className="dental_card_body">
                      <div className="dental_card_item">
                        <span className="dental_card_label">Full Name: </span>
                        <span className="dental_card_value">
                          {item.fullname}
                        </span>
                      </div>
                      <div className="dental_card_item">
                        <span className="dental_card_label">Phone: </span>
                        <span className="dental_card_value">{item.phone}</span>
                      </div>
                      <div className="dental_card_item">
                        <span className="dental_card_label">Email: </span>
                        <span className="dental_card_value">{item.email}</span>
                      </div>
                      <div className="dental_card_item">
                        <span className="dental_card_label">Service: </span>
                        <span className="dental_card_value">
                          {item.service}
                        </span>
                      </div>
                      <div className="dental_card_item">
                        <span className="dental_card_label">Clinic: </span>
                        <span className="dental_card_value">{item.clinic}</span>
                      </div>
                      <div className="dental_card_item">
                        <span className="dental_card_label">Doctor: </span>
                        <span className="dental_card_value">{item.doctor}</span>
                      </div>
                      <div className="dental_card_item">
                        <span className="dental_card_label">Date: </span>
                        <span className="dental_card_value">{item.date}</span>
                      </div>
                      <div className="dental_card_item">
                        <span className="dental_card_label">Charges: </span>
                        <span className="dental_card_value">{item.price}</span>
                      </div>
                      <div className="dental_card_item">
                        <span className="dental_card_label">Time: </span>
                        <span className="dental_card_value">
                          {item.timeSlotStart} - {item.timeSlotEnd}
                        </span>
                      </div>
                      <div className="dental_card_item">
                        <span className="dental_card_label">Status: </span>
                        <span className="dental_card_value">
                          {item.appointmentStatus
                            ? item.appointmentStatus
                            : "Not yet reviewed"}
                        </span>
                      </div>
                    </div>
                    <div className="dental_card_footer">
                      <Link
                        className="dental_update"
                        to={`/rescheduleaAppointments/${item._id}`}
                      >
                        Reschedule
                      </Link>
                      <button
                        className="dental_deletbtn"
                        onClick={() => deleteHandler(item._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAppointment;
