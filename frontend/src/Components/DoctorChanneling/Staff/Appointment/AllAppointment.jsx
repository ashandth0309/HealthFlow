import StafNav from "../StafNav";
import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link, useNavigate } from "react-router-dom";
import NotFound from "./img/nofound.png";

const URL = "http://localhost:8081/doctorAppointment";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function AllAppointment() {
  const navigate = useNavigate();
  const [dappoiment, setDAppoiment] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setDAppoiment(data.dappoiment));
  }, []);

  const deleteHandler = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Appointment?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`);
        window.alert("Appointment Deleted successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting details:", error);
      }
    }
  };

  /* Navigate to Room Assignment with selected appointment */
  const handleAssignRoom = (appointment) => {
    // Store appointment data to pass to room assignment page
    const appointmentData = {
      appointmentId: appointment._id,
      doctorAppoimentID: appointment.doctorAppoimentID,
      fullname: appointment.fullname,
      phone: appointment.phone,
      gmail: appointment.gmail,
      doctorname: appointment.doctorname,
      location: appointment.location,
      date: appointment.date,
      session: appointment.session,
      price: appointment.price,
      timeSlot: appointment.timeSlot
    };

    // Navigate to AdminDisplayPage with state - CORRECTED PATH
    navigate('/adminAdmit', { state: { appointmentData } });
  };

  /* Search Function */
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.dappoiment.filter((dappoiment) =>
        Object.values(dappoiment).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setDAppoiment(filtered);
      setNoResults(filtered.length === 0);
    });
  };

  /* Report Generation Function */
  const handleGenerateReport = () => {
    const doc = new jsPDF("landscape");

    doc.text("Appointment Report", 20, 10);

    const columns = [
      "Full Name",
      "Appoiment ID",
      "Phone",
      "Email",
      "Doctor Name",
      "Location",
      "Date",
      "Session",
      "Charges",
      "Time",
    ];

    const rows = dappoiment.map((item) => [
      item.fullname,
      item.doctorAppoimentID,
      item.phone,
      item.gmail,
      item.doctorname,
      item.location,
      item.date,
      item.session,
      item.price,
      item.timeSlot,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("appointment_report.pdf");
  };

  return (
    <div>
      <div>
        <StafNav />
        <div className="main_doctor_staf">
          <h1 className="topic_admin_doctor">Appointment Details</h1>
          <div className="action_set_staf">
            <tr>
              <td>
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  name="search"
                  className="search_input"
                  placeholder="Search Here..."
                ></input>
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
                    <th className="doctor_table_th">Appoiment ID</th>
                    <th className="doctor_table_th">Full Name</th>
                    <th className="doctor_table_th">Phone</th>
                    <th className="doctor_table_th">Email</th>
                    <th className="doctor_table_th">Doctor Name</th>
                    <th className="doctor_table_th">Location</th>
                    <th className="doctor_table_th">Date</th>
                    <th className="doctor_table_th">Session Name</th>
                    <th className="doctor_table_th">Time</th> 
                    <th className="doctor_table_th">Charges</th>
                    <th className="doctor_table_th">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {dappoiment.map((item, index) => (
                    <tr 
                      className="appointment-row" 
                      key={index}
                      onClick={() => handleAssignRoom(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="doctor_table_td">
                        {item.doctorAppoimentID}
                      </td>
                      <td className="doctor_table_td">{item.fullname}</td>
                      <td className="doctor_table_td">{item.phone}</td>
                      <td className="doctor_table_td">{item.gmail}</td>
                      <td className="doctor_table_td">{item.doctorname}</td>
                      <td className="doctor_table_td">{item.location}</td>
                      <td className="doctor_table_td">{item.date}</td>
                      <td className="doctor_table_td">{item.session}</td>
                      <td className="doctor_table_td">{item.timeSlot}</td>
                      <td className="doctor_table_td">Rs.{item.price}.00</td>
                      <td className="doctor_table_td data_btn">
                        <Link
                          className="doctor_update"
                          to={`/updateAppoimentDoc/${item._id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Update
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHandler(item._id);
                          }}
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

export default AllAppointment;