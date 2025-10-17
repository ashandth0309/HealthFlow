import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import StafNav from "../StafNav";
import NotFound from "./img/nofound.png";
import "../staff.css";
const URL = "http://localhost:8081/appointment";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Stafhome() {
  const [dental, setDental] = useState([]);
  const [appointmentsByMonth, setAppointmentsByMonth] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => {
      setDental(data.dental);
      const groupedByMonth = groupByMonth(data.dental);
      setAppointmentsByMonth(groupedByMonth);
    });
  }, []);

  // Function to group appointments by month
  const groupByMonth = (appointments) => {
    return appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.date);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(appointment);
      return acc;
    }, {});
  };

  // Search function
  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.dental.filter((item) =>
        Object.values(item).some((field) =>
          field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setDental(filtered);
      setAppointmentsByMonth(groupByMonth(filtered));
      setNoResults(filtered.length === 0);
    });
  };

  // Generate PDF report function
  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.text("Appointments Report", 20, 10);

    const columns = [
      "Full Name",
      "Appointment ID",
      "Phone",
      "Email",
      "Service",
      "Clinic",
      "Doctor",
      "Date",
      "Time",
      "Charges",
      "Status",
    ];

    const rows = dental.map((item) => [
      item.fullname,
      item.appointmentID,
      item.phone,
      item.email,
      item.service,
      item.clinic,
      item.doctor,
      item.date,
      item.time,
      item.price,
      item.appointmentStatus || "Not yet reviewed",
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("appointments_report.pdf");
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
        history("/stafhome");
        window.location.reload(); // Reload the page
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error Cancel details:", error);
      }
    }
  };
  return (
    <div>
      <StafNav />
      <div className="main_dental_staf">
        <h1 className="topic_admin_dental">Appointment Details</h1>
        <div className="action_set_staf">
          <div>
            <input
              type="text"
              value={searchTerm}
              className="search_input"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search here"
            />
            <button className="search_btn" onClick={handleSearch}>
              Search
            </button>
          </div>
          <button className="denttl_btnn" onClick={handleGenerateReport}>
            Generate Report
          </button>
        </div>

        {Object.keys(appointmentsByMonth).length === 0 && noResults ? (
          <div className="not_found_box">
            <img src={NotFound} alt="noimg" className="notfound" />
            <p className="nodata_pera">No Details Found</p>
          </div>
        ) : (
          Object.keys(appointmentsByMonth).map((monthYear) => (
            <div className="table_container" key={monthYear}>
              <h2 className="month_data">{monthYear}</h2>
              <table className="dental_table">
                <thead className="">
                  <tr>
                    <th className="dental_table_th">Appointment ID</th>
                    <th className="dental_table_th">Full Name</th>
                    <th className="dental_table_th">Phone</th>
                    <th className="dental_table_th">Email</th>
                    <th className="dental_table_th">Service</th>
                    <th className="dental_table_th">Clinic</th>
                    <th className="dental_table_th">Doctor Name</th>
                    <th className="dental_table_th">Date</th>
                    <th className="dental_table_th">Time</th>
                    <th className="dental_table_th">Status</th>
                    <th className="dental_table_th">Charges</th>
                    <th className="dental_table_th">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsByMonth[monthYear].map((item, index) => (
                    <tr key={index}>
                      <td className="dental_table_td">{item.appointmentID}</td>
                      <td className="dental_table_td">{item.fullname}</td>
                      <td className="dental_table_td">{item.phone}</td>
                      <td className="dental_table_td">{item.email}</td>
                      <td className="dental_table_td">{item.service}</td>
                      <td className="dental_table_td">{item.clinic}</td>
                      <td className="dental_table_td">{item.doctor}</td>
                      <td className="dental_table_td">{item.date}</td>
                      <td className="dental_table_td">
                        {item.timeSlotStart} - {item.timeSlotEnd}
                      </td>
                      <td className="dental_table_td">
                        {item.appointmentStatus
                          ? item.appointmentStatus
                          : "Pendin"}
                      </td>
                      <td className="dental_table_td">{item.price}</td>
                      <td className="dental_table_td btn_tableset">
                        <Link
                          to={`/addAppointmentStatus/${item._id}`}
                          className="dental_update"
                        >
                          Status
                        </Link>
                        <Link
                          to={`/modifyAppointmentsSatff/${item._id}`}
                          className="dental_update"
                        >
                          Modify
                        </Link>
                        <button
                          onClick={() => deleteHandler(item._id)}
                          className="dental_deletbtn2"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Stafhome;
