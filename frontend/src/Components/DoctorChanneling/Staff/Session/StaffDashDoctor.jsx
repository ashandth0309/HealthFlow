/* eslint-disable no-unused-vars */
import StafNav from "../StafNav";
import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/nofound.png";
import { Link } from "react-router-dom";

const URL = "http://localhost:8081/session";
const appointmentURL = "http://localhost:8081/doctorAppointment";

// Fetch appointments related to a session
const fetchAppointmentsForSession = async (session) => {
  return await axios.get(appointmentURL).then((res) => {
    const appointments = res.data.dappoiment;
    return appointments.filter(
      (appointment) =>
        appointment.session === session.sessionname &&
        appointment.date === session.date &&
        appointment.location === session.location &&
        appointment.price === session.price &&
        appointment.doctorname === session.doctorname &&
        appointment.timeSlot ===
          session.timeslots
            .map((slot) => `${slot.starttime} - ${slot.endtime}`)
            .join(", ")
    ).length; // Return the count of matching appointments
  });
};

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function StaffDashDoctor() {
  // Fetch session data and appointment counts
  const [session, setSession] = useState([]);
  const [sessionWithAppointments, setSessionWithAppointments] = useState([]);
  const [originalSessions, setOriginalSessions] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => {
      const sessionData = data.session;
      setOriginalSessions(sessionData);
      // Fetch the count of appointments for each session
      Promise.all(
        sessionData.map(async (sess) => {
          const appointmentCount = await fetchAppointmentsForSession(sess);
          return { ...sess, appointmentCount }; // Add the count to each session
        })
      ).then((sessionsWithCount) => {
        setSessionWithAppointments(sessionsWithCount);
      });
    });
  }, []);

  // Delete handler
  const deleteHandler = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this session?"
    );
    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`);
        window.alert("Session deleted successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  // Search function
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    const filtered = originalSessions.filter((session) =>
      Object.values(session).some((field) =>
        field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setSessionWithAppointments(filtered); // Update the session with appointments
    setNoResults(filtered.length === 0);
  };

  // Report generation function
  const handleGenerateReport = () => {
    const doc = new jsPDF("landscape");
    doc.text("Session Report", 20, 10);
    const columns = [
      "Session Name",
      "Session ID",
      "Doctor Name",
      "Address",
      "Seat Count",
      "Time Slots",
      "Date",
      "Charges",
      "Appointments",
    ];
    const rows = sessionWithAppointments.map((item) => [
      item.sessionname,
      item.sectionID,
      item.doctorname,
      item.location,
      item.seatcount,
      item.timeslots
        .map((slot) => `${slot.starttime} - ${slot.endtime}`)
        .join(", "),
      item.date,
      item.price,
      item.appointmentCount,
    ]);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("session_report.pdf");
  };

  return (
    <div>
      <div>
        <StafNav />
        <div className="main_doctor_staf">
          <h1 className="topic_admin_doctor">Session Details</h1>
          <div className="action_set_staf">
            <button
              className="denttl_btnn"
              onClick={() => (window.location.href = "/addsession")}
            >
              Add New Session
            </button>
            <tr>
              <td>
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  name="search"
                  className="search_input"
                  placeholder="Search Here..."
                />
              </td>

              <td>
                <button onClick={handleSearch} className="search_btn">
                  Search
                </button>
              </td>
            </tr>
            <button className="denttl_btnn" onClick={handleGenerateReport}>
              Generate Report
            </button>
          </div>
          <br /> <br />
          {noResults ? (
            <div className="not_found_box">
              <img src={NotFound} alt="noimg" className="notfound" />
              <p className="nodata_pera">No Details Found</p>
            </div>
          ) : (
            <div className="table_container">
              <table className="doctor_table">
                <thead>
                  <tr className="admin_tbl_tr">
                    <th className="doctor_table_th">Session Name</th>
                    <th className="doctor_table_th">Session ID</th>
                    <th className="doctor_table_th">Doctor Name</th>
                    <th className="doctor_table_th">Address</th>
                    <th className="doctor_table_th">Seat Count</th>
                    <th className="doctor_table_th">Time Slot</th>
                    <th className="doctor_table_th">Date</th>
                    <th className="doctor_table_th">Charges</th>
                    <th className="doctor_table_th">Appointments</th>
                    <th className="doctor_table_th">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionWithAppointments.map((item, index) => (
                    <tr key={index}>
                      <td className="doctor_table_td">{item.sessionname}</td>
                      <td className="doctor_table_td">{item.sectionID}</td>
                      <td className="doctor_table_td">{item.doctorname}</td>
                      <td className="doctor_table_td">{item.location}</td>
                      <td className="doctor_table_td">{item.seatcount}</td>
                      <td className="doctor_table_td">
                        {item.timeslots
                          .map((slot) => `${slot.starttime} - ${slot.endtime}`)
                          .join(", ")}
                      </td>
                      <td className="doctor_table_td">{item.date}</td>
                      <td className="doctor_table_td">Rs.{item.price}.00</td>
                      <td className="doctor_table_td">
                        {item.appointmentCount}
                      </td>{" "}
                      {/* Display count */}
                      <td className="doctor_table_td data_btn">
                        <Link
                          className="doctor_update"
                          to={`/updateSession/${item._id}`}
                        >
                          Update
                        </Link>
                        <button
                          onClick={() => deleteHandler(item._id)}
                          className="doctor_deletbtn2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffDashDoctor;
