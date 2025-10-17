import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import StafNav from "../StafNav";
import NotFound from "./img/nofound.png";

const URL = "http://localhost:8081/doctor";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function DoctorDash() {
  //fetch data
  const [doctor, setDoctor] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setDoctor(data.doctorfunction));
  }, []);

  /*Delete Function */
  const history = useNavigate();
  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to delete this Doctor?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`); // Correct URL construction
        window.alert("Doctor deleted successfully!");
        history("/dochome");
        window.location.reload(); // Reload the page
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error deleting details:", error);
      }
    }
  };

  /*Search Function */
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.doctorfunction.filter((doctorfunction) =>
        Object.values(doctorfunction).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setDoctor(filtered);
      setNoResults(filtered.length === 0);
    });
  };

  /* Report Generation Function */
  const handleGenerateReport = () => {
    const doc = new jsPDF();

    doc.text("Doctor Report", 20, 10);

    const columns = [
      "Doctor Name",
      "Doctor ID",
      "Gender",
      "Gmail",
      "Clinic",
      "Start Time",
      "End Time",
      "Date",
      "Charges",
    ];

    const rows = doctor.map((item) => [
      item.doctorName,
      item.doctorID,
      item.gender,
      item.gmail,
      item.clinic,
      item.timeSlotStart,
      item.timeSlotEnd,
      item.date,
      item.price,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("doctor_report.pdf");
  };
  return (
    <div>
      <StafNav />
      <div className="main_dental_staf">
        <h1 className="topic_admin_dental">Doctor Details</h1>
        <div>
          <div className="action_set_staf">
            <button
              className="denttl_btnn"
              onClick={() => (window.location.href = "/addDoctor")}
            >
              Add Doctor
            </button>

            <tr>
              <td className="">
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  name="search"
                  className="search_input"
                  placeholder="Search Here..."
                ></input>
              </td>

              <td>
                <button className="search_btn" onClick={handleSearch}>
                  Search
                </button>
              </td>
            </tr>
            <button className="denttl_btnn" onClick={handleGenerateReport}>
              Generate Report
            </button>
          </div>
          <br />
          <br />
          {noResults ? (
            <div className="not_found_box">
              <img src={NotFound} alt="noimg" className="notfound" />
              <p className="nodata_pera">No Details Found</p>
            </div>
          ) : (
            <table className="dental_table">
              <thead>
                <tr className="admin_tbl_tr">
                  <th className="dental_table_th">doctorName</th>
                  <th className="dental_table_th">doctorID</th>
                  <th className="dental_table_th">gender</th>
                  <th className="dental_table_th">gmail</th>
                  <th className="dental_table_th">clinic</th>
                  <th className="dental_table_th">Time</th>
                  <th className="dental_table_th">Date</th>
                  <th className="dental_table_th">Charges</th>
                  <th className="dental_table_th">Action</th>
                </tr>
              </thead>

              <tbody>
                {doctor.map((item, index) => (
                  <tr className="" key={index}>
                    <td className="dental_table_td">{item.doctorName}</td>
                    <td className="dental_table_td">{item.doctorID}</td>
                    <td className="dental_table_td">{item.gender}</td>
                    <td className="dental_table_td">{item.gmail}</td>
                    <td className="dental_table_td">{item.clinic}</td>
                    <td className="dental_table_td">
                      {item.timeSlotStart} - {item.timeSlotEnd}
                    </td>
                    <td className="dental_table_td">{item.date}</td>
                    <td className="dental_table_td">Rs.{item.price}.00</td>
                    <td className="dental_table_td">
                      <button
                        onClick={() => deleteHandler(item._id)}
                        className="dental_deletbtn2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDash;
