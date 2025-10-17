/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import HomeNav from "../Home/HomeNav";
import { Link, useNavigate } from "react-router-dom";
import "./admitdata.css";
import NotFound from "./img/nofound.png";
function FetchAdmitData() {
  const [nic, setNIC] = useState("");
  const [admitID, setAdmitID] = useState("");
  const [admitData, setAdmitData] = useState(null);
  const [error, setError] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAdmitID, setShowAdmitID] = useState(true);

  const fetchByNIC = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/admit/byNIC/${nic}`
      );
      setAdmitData(response.data.admit);
      setError("");
    } catch (err) {
      setError("No data found for the provided NIC.");
      setAdmitData(null);
    }
  };

  const fetchByAdmitID = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/admit/byAdmitID/${admitID}`
      );
      setAdmitData(response.data.admit);
      setError("");
    } catch (err) {
      setError("No data found for the provided AdmitID.");
      setAdmitData(null);
    }
  };

  const handleDelete = async () => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    // If the user confirms, proceed with deletion
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8081/admit/${admitData._id}`);
        setAdmitData(null);
        setError("");
        alert("Record deleted successfully");
        setShowUpdateForm(false);
      } catch (err) {
        setError("Failed to delete the record.");
      }
    }
  };

  // Function to toggle to NIC field
  const showNICField = () => {
    setShowAdmitID(false);
  };

  // Function to toggle to Admit ID field
  const showAdmitIDField = () => {
    setShowAdmitID(true);
  };

  return (
    <div>
      <HomeNav />
      <div className="check_gmail_box_admit">
        {showAdmitID ? (
          <div className="admit_gmail_box">
            <label className="form_label_gmail" htmlFor="admitID">
              Admit ID
            </label>{" "}
            <br />
            <input
              type="text"
              placeholder="Enter Admit ID"
              className="gmail_insert"
              value={admitID}
              onChange={(e) => setAdmitID(e.target.value)}
            />
            <button onClick={fetchByAdmitID} className="search_btn_admit">
              View
            </button>
            <p className="foget_check_fecht" onClick={showNICField}>
              Try by NIC
            </p>
          </div>
        ) : (
          <div className="admit_gmail_box">
            <label className="form_label_gmail" htmlFor="nic">
              NIC
            </label>

            <br />
            <input
              type="text"
              placeholder="Enter NIC"
              className="gmail_insert"
              value={nic}
              onChange={(e) => setNIC(e.target.value)}
            />
            <button className="search_btn_admit" onClick={fetchByNIC}>
              View
            </button>
            <p className="foget_check_fecht" onClick={showAdmitIDField}>
              Try by Admit ID
            </p>
          </div>
        )}
      </div>
      {error && (
        <div className="not_found_box">
          <img src={NotFound} alt="noimg" className="notfound" />
          <p className="nodata_pera">No Details Found</p>
        </div>
      )}
      {admitData && (
        <div className="data_card_admit">
          <div className="data_from_admit">
            <h3 className="main_topic_admit">Your Admit Details</h3>
            <p className="admit_data_from_details">
              {admitData.prescription ? (
                <img
                  src={`http://localhost:8081/uploadsIMG/${admitData.prescription}`}
                  alt={admitData.prescription}
                  className="presImg cen"
                />
              ) : (
                <span>No image available</span>
              )}
            </p>
            <div className="data_card_details_set">
              <div>
                <p className="admit_data_from_details">
                  {" "}
                  <strong>Status:</strong> {admitData.status || "Pending"}
                </p>{" "}
                <p className="admit_data_from_details">
                  <strong>Hospital:</strong> {admitData.hospital}
                </p>
                <p className="admit_data_from_details">
                  <strong>Date:</strong> {admitData.date}
                </p>
                <p className="admit_data_from_details">
                  <strong>Full Name:</strong> {admitData.fullname}
                </p>
                <p className="admit_data_from_details">
                  <strong>Charges:</strong> Rs.{admitData.price}.00
                </p>
                <p className="admit_data_from_details">
                  <strong>Gender:</strong> {admitData.gender}
                </p>
                <p className="admit_data_from_details">
                  <strong>Phone:</strong> {admitData.phone}
                </p>
                <p className="admit_data_from_details">
                  <strong>Address:</strong> {admitData.address}
                </p>
                <p className="admit_data_from_details">
                  <strong>Birth Day:</strong> {admitData.birth}
                </p>
              </div>
              <div>
                {" "}
                <p className="admit_data_from_details">
                  <strong>Guardian:</strong> {admitData.guardian}
                </p>
                <p className="admit_data_from_details">
                  <strong>Relationship:</strong> {admitData.relationship}
                </p>
                <p className="admit_data_from_details">
                  <strong>Contact:</strong> {admitData.contact}
                </p>
                <p className="admit_data_from_details">
                  <strong>Admit ID:</strong> {admitData.admitID}
                </p>
                <p className="admit_data_from_details">
                  <strong>NIC:</strong> {admitData.nic}
                </p>
           
                <p className="admit_data_from_details">
                  <strong>Medications:</strong> {admitData.medications}
                </p>
                <p className="admit_data_from_details">
                  <strong>Past Medical History:</strong> {admitData.past}
                </p>
                <p className="admit_data_from_details">
                  <strong>Symptoms:</strong> {admitData.symptoms}
                </p>
              </div>
            </div>

            <div className="data_action_card">
              <button className="admit_update">
                <Link className=" linkbtn" to={`/admitUpdate/${admitData._id}`}>
                  Update
                </Link>
              </button>
              <button className="admit_deletbtn2" onClick={handleDelete}>
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
      <br /> <br /> <br />
      <br />
    </div>
  );
}

export default FetchAdmitData;
