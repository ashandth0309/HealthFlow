import { useState } from "react";
import axios from "axios";
import HomeNav from "../Home/HomeNav";
import { Link } from "react-router-dom";

const URL = "http://localhost:8081/doctorAppointment";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function MyDocAppointment() {
  const [dappoiment, setDAppoiment] = useState([]);
  const [gmail, setGmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setGmail(e.target.value);
  };

  const handleViewAppointments = () => {
    if (gmail === "") {
      setMessage("Please enter an email.");
      return;
    }

    fetchHandler()
      .then((data) => {
        const filteredData = data.dappoiment.filter(
          (appointment) => appointment.gmail === gmail
        );

        if (filteredData.length > 0) {
          setDAppoiment(filteredData);
          setMessage(""); // Clear any previous messages
        } else {
          setDAppoiment([]); // Clear table if no data found
          setMessage("No appointments found for this email.");
        }
      })
      .catch((error) => {
        setMessage("Error fetching data. Please try again.");
        console.error(error);
      });
  };

  const deleteHandler = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Appointment?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`);
        window.alert("Appointment deleted successfully!");
        handleViewAppointments(); // Refresh the list of appointments
      } catch (error) {
        console.error("Error deleting appointment:", error);
        window.alert("Error deleting appointment. Please try again.");
      }
    }
  };

  return (
    <div className="mydocappointment_background">
      <HomeNav />
      <div className="check_gmail_box_doctor">
        <div className="doctor_gmail_box">
          <label className="form_label_email" htmlFor="email">
            Enter Your Gmail
          </label>
          <br />
          <input
            type="email"
            id="email"
            className="gmail_insert"
            value={gmail}
            onChange={handleEmailChange}
          />
          <br />
          <button onClick={handleViewAppointments} className="submit_btn_gmail">
            View My Appointments
          </button>
        </div>
      </div>
      {message && (
        <div className="not_found_box">
          <p className="nodata_pera">{message}</p>
        </div>
      )}
      <div className="main_doctor_staf">
        {dappoiment.length > 0 && (
          <div className="table_container">
            <h1 className="topic_admin_doctor">Appointment Details</h1>
            <table className="doctor_table">
              <thead>
                <tr className="admin_tbl_tr">
                  <th className="doctor_table_th">Appointment ID</th>
                  <th className="doctor_table_th">Full Name</th>
                  <th className="doctor_table_th">Phone</th>
                  <th className="doctor_table_th">Email</th>
                  <th className="doctor_table_th">Date</th>
                  <th className="doctor_table_th">Session Name</th>
                  <th className="doctor_table_th">Time</th>
                  <th className="doctor_table_th">Doctor Name</th>{" "}
                  {/* New column */}
                  <th className="doctor_table_th">Location</th>{" "}
                  {/* New column */}
                  <th className="doctor_table_th">Action</th>
                </tr>
              </thead>
              <tbody>
                {dappoiment.map((item) => (
                  <tr className="admin_tbl_tr" key={item._id}>
                    <td className="doctor_table_td">
                      {item.doctorAppoimentID}
                    </td>
                    <td className="doctor_table_td">{item.fullname}</td>
                    <td className="doctor_table_td">{item.phone}</td>
                    <td className="doctor_table_td">{item.gmail}</td>
                    <td className="doctor_table_td">{item.date}</td>
                    <td className="doctor_table_td">{item.session}</td>
                    <td className="doctor_table_td">{item.timeSlot}</td>
                    <td className="doctor_table_td">{item.doctorname}</td>{" "}
                    {/* Display doctorname */}
                    <td className="doctor_table_td">{item.location}</td>{" "}
                    {/* Display location */}
                    <td className="doctor_table_td data_btn">
                      <Link
                        className="doctor_update"
                        to={`/updateAppoimentUser/${item._id}`}
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => deleteHandler(item._id)}
                        className="doctor_deletbtn2"
                      >
                        Cancel
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
  );
}

export default MyDocAppointment;
