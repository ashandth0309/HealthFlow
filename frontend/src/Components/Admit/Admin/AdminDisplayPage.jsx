/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link, useNavigate } from "react-router-dom";
import HomeNav from "../Home/HomeNav";

function DisplayAllAdmits() {
  const [admitData, setAdmitData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmitData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/admit");
        setAdmitData(response.data.admit);
        setFilteredData(response.data.admit);
        setError("");
      } catch (err) {
        setError("Failed to fetch data");
        setAdmitData([]);
        setFilteredData([]);
      }
    };

    fetchAdmitData();
  }, []);

  // Search functionality
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = admitData.filter((admit) =>
      Object.values(admit).some((val) =>
        val.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  // Generate and download report
  const generateReport = () => {
    const doc = new jsPDF("landscape");
    doc.text("Admit Records Report", 14, 8);
    doc.autoTable({
      head: [
        [
          "Hospital",
          "Date",
          "Full Name",
          "Gender",
          "Phone",
          "Address",
          "Admit ID",
          "NIC",
          "Medications",
          "Medical History",
          "Charges",
        ],
      ],
      body: filteredData.map((admit) => [
        admit.hospital,
        admit.date,
        admit.fullname,
        admit.gender,
        admit.phone,
        admit.address,
        admit.admitID,
        admit.nic,
        admit.medications,
        admit.past,
        admit.price,
      ]),
    });
    doc.save("admit_records_report.pdf"); //you can change file saved name
  };

  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to delete this Data?"
    );

    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8081/admit/${_id}`); // Correct URL construction
        window.alert("Deleted successfully!");
        window.location.reload(); // Reload the page
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error deleting details:", error);
      }
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <div className="">
        <div className="main_admit_staf">
          <h2 className="topic_admin_admit">All Admit Records</h2>
          {error && <p>{error}</p>}

          <div className="action_set_staf">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              className="search_input"
              onChange={handleSearch}
            />
            <button className="admit_btnn" onClick={generateReport}>
              Generate Report
            </button>
          </div>
          <br />
          <div className="table_container">
            <table className="admit_table">
              <thead>
                <tr className="admin_tbl_tr">
                  <th className="admit_table_th">Hospital</th>
                  <th className="admit_table_th">Date</th>
                  <th className="admit_table_th">Full Name</th>
                  <th className="admit_table_th">BirthDay</th>
                  <th className="admit_table_th">Gender</th>
                  <th className="admit_table_th">Phone</th>
                  <th className="admit_table_th">Address</th>
                  <th className="admit_table_th">Guardian</th>
                  <th className="admit_table_th">Relationship</th>
                  <th className="admit_table_th">Contact</th>
                  <th className="admit_table_th">Admit ID</th>
                  <th className="admit_table_th">NIC</th>
                  <th className="admit_table_th">Medications</th>
                  <th className="admit_table_th">Past Medical History</th>
                  <th className="admit_table_th">Symptoms</th>
                  <th className="admit_table_th">Prescription</th>
                  <th className="admit_table_th">Charges</th>
                  <th className="admit_table_th">Status</th>
                  <th className="admit_table_th">Discharge Status</th>
                  <th className="admit_table_th">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((admit) => (
                    <tr key={admit._id}>
                      <td className="admit_table_td">{admit.hospital}</td>
                      <td className="admit_table_td">{admit.date}</td>
                      <td className="admit_table_td">{admit.fullname}</td>
                      <td className="admit_table_td">{admit.birth}</td>
                      <td className="admit_table_td">{admit.gender}</td>
                      <td className="admit_table_td">{admit.phone}</td>
                      <td className="admit_table_td">{admit.address}</td>
                      <td className="admit_table_td">{admit.guardian}</td>
                      <td className="admit_table_td">{admit.relationship}</td>
                      <td className="admit_table_td">{admit.contact}</td>
                      <td className="admit_table_td">{admit.admitID}</td>
                      <td className="admit_table_td">{admit.nic}</td>
                      <td className="admit_table_td">{admit.medications}</td>
                      <td className="admit_table_td">{admit.past}</td>
                      <td className="admit_table_td">{admit.symptoms}</td>
                      <td className="admit_table_td">
                        {admit.prescription ? (
                          <img
                            src={`http://localhost:8081/uploadsIMG/${admit.prescription}`}
                            alt={admit.prescription}
                            className="presImg"
                          />
                        ) : (
                          <span>No image available</span>
                        )}
                      </td>
                      <td className="admit_table_td">Rs.{admit.price}.00</td>
                      <td className="admit_table_td">
                        {admit.status || "Pending"}
                      </td>
                      <td className="admit_table_td">
                        {admit.discharge || "Not Yet"}
                      </td>
                      <td className="admit_table_td data_btn">
                        <button
                          className="admit_deletbtn2 "
                          onClick={() => deleteHandler(admit._id)}
                        >
                          Delete
                        </button>

                        <button className="admit_update">
                          <Link
                            className=" linkbtn"
                            to={`/discharge/${admit._id}`}
                          >
                            Discharge
                          </Link>
                        </button>
                        <button className="admit_update">
                          <Link
                            className=" linkbtn"
                            to={`/admitadminUpdate/${admit._id}`}
                          >
                            Edit
                          </Link>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayAllAdmits;
