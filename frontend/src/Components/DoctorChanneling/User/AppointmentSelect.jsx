/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import HomeNav from "../Home/HomeNav";
import axios from "axios";

const URL = "http://localhost:8081/session";
const appointmentURL = "http://localhost:8081/doctorAppointment";

function AppointmentSelect() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionname, setSessionName] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  // Fetch sessions and appointments
  useEffect(() => {
    const fetchSessionsAndAppointments = async () => {
      try {
        const sessionResponse = await axios.get(URL);
        const appointmentResponse = await axios.get(appointmentURL);

        const sessionsWithAppointmentCounts = sessionResponse.data.session.map(
          (session) => {
            const appointmentCount = appointmentResponse.data.dappoiment.filter(
              (appointment) =>
                appointment.session === session.sessionname &&
                appointment.date === session.date &&
                appointment.location === session.location &&
                appointment.price === session.price &&
                appointment.doctorname === session.doctorname
            ).length;

            return {
              ...session,
              appointmentCount,
            };
          }
        );

        // Filter sessions where seat count is greater than appointment count
        const availableSessions = sessionsWithAppointmentCounts.filter(
          (session) => session.seatcount > session.appointmentCount
        );

        setSessions(sessionsWithAppointmentCounts);
        setFilteredSessions(availableSessions);
      } catch (error) {
        console.error("Error fetching sessions or appointments:", error);
      }
    };

    fetchSessionsAndAppointments();
  }, []);

  // Load data from local storage on mount
  useEffect(() => {
    const storedSessionDetails = JSON.parse(
      localStorage.getItem("sessionDetails")
    );

    if (storedSessionDetails) {
      setSessionName(storedSessionDetails.sessionname);
      setSessionDate(storedSessionDetails.date);
      setDoctorName(storedSessionDetails.doctorname);
      setLocation(storedSessionDetails.location);
      setPrice(storedSessionDetails.price);
      // Set the time slots based on the stored data if available
      if (storedSessionDetails.timeslot) {
        setTimeSlots([storedSessionDetails.timeslot]); // Assuming you want to set it to an array for future use
        setSelectedTime(
          `${storedSessionDetails.timeslot.starttime} - ${storedSessionDetails.timeslot.endtime}`
        );
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const sessionDetails = {
      session: sessionname,
      date: sessionDate,
      timeSlot: selectedTime,
      doctorname: doctorName,
      price: price,
      location,
    };

    localStorage.setItem("sessionDetails", JSON.stringify(sessionDetails));
    window.location.href = "/addAppoimentdoc";
  };

  return (
    <div>
      <div className="doctor_home_bk">
        <HomeNav />
        <div className="form_full_doctor_code">
          <div className="doctor_from_full">
            <h1 className="form_head_doctor">Select Available Time Slot</h1>
            <form className="doctor-form" onSubmit={handleSubmit}>
              <div className="input_group">
                <div className="form-group">
                  <label className="form-label" htmlFor="session">
                    Session Name:
                  </label>
                  <br />
                  <input
                    type="text"
                    id="session"
                    name="session"
                    className="form-input"
                    value={sessionname}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="date">
                    Date:
                  </label>
                  <br />
                  <input
                    type="text"
                    id="date"
                    name="date"
                    className="form-input"
                    value={sessionDate}
                    readOnly
                  />
                </div>
              </div>

              <div className="input_group">
                <div className="form-group">
                  <label className="form-label" htmlFor="doctor">
                    Doctor Name:
                  </label>
                  <br />
                  <input
                    type="text"
                    id="doctor"
                    name="doctor"
                    className="form-input"
                    value={doctorName}
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
                    value={location}
                    readOnly
                  />
                </div>
              </div>
              <div className="input_group">
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <br />
                  <input
                    type="text"
                    id="timeSlot"
                    name="timeSlot"
                    className="form-input"
                    value={selectedTime}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Charges (Rs)</label>
                  <br />
                  <input
                    type="text"
                    id="timeSlot"
                    name="timeSlot"
                    className="form-input"
                    value={price}
                    readOnly
                  />
                </div>
              </div>
              <button type="submit" className="submit_btn">
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentSelect;
