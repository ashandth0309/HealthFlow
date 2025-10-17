/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import "./DischargeAdmit.css"; // We'll create this CSS file

function DischargeAdmit() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [patientData, setPatientData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch the existing data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/admit/${id}`);
        setInputs(response.data.admit);
        setPatientData(response.data.admit);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFile(files[0]);
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in inputs) {
      formData.append(key, inputs[key]);
    }
    if (file) {
      formData.append("prescription", file);
    }

    try {
      await axios.put(`http://localhost:8081/admit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.alert("Record Updated successfully!");
      navigate("/adminAdmit");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="discharge-container">
      <br />
      <br />
      
      <div className="two-column-layout">
        {/* Left Column - Patient Information */}
        <div className="left-column">
          <div className="data_card_admit patient-info-card">
            <div className="data_from_admit">
              <h3 className="main_topic_admit">Patient Information</h3>
              
              <div className="patient-details">
                <div className="detail-row">
                  <label className="detail-label">Patient Name:</label>
                  <span className="detail-value">{patientData.patientName || "N/A"}</span>
                </div>
                
                <div className="detail-row">
                  <label className="detail-label">Patient ID:</label>
                  <span className="detail-value">{patientData.patientId || "N/A"}</span>
                </div>
                
                <div className="detail-row">
                  <label className="detail-label">Admission Date:</label>
                  <span className="detail-value">{patientData.admissionDate || "N/A"}</span>
                </div>
                
                <div className="detail-row">
                  <label className="detail-label">Ward Number:</label>
                  <span className="detail-value">{patientData.wardNumber || "N/A"}</span>
                </div>
                
                <div className="detail-row">
                  <label className="detail-label">Bed Number:</label>
                  <span className="detail-value">{patientData.bedNumber || "N/A"}</span>
                </div>
                
                <div className="detail-row">
                  <label className="detail-label">Medical Condition:</label>
                  <span className="detail-value">{patientData.medicalCondition || "N/A"}</span>
                </div>
                
                <div className="detail-row">
                  <label className="detail-label">Doctor In Charge:</label>
                  <span className="detail-value">{patientData.doctorInCharge || "N/A"}</span>
                </div>
                
                <div className="detail-row">
                  <label className="detail-label">Current Status:</label>
                  <span className="detail-value">{patientData.status || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Discharge Summary Section */}
          <div className="data_card_admit discharge-summary-card">
            <div className="data_from_admit">
              <h3 className="main_topic_admit">Discharge Summary Preview</h3>
              
              <div className="summary-content">
                <div className="summary-section">
                  <h4>Treatment Provided</h4>
                  <p>Laboratories: reproducibility performed at July 16, 2024.</p>
                </div>
                
                <div className="summary-section">
                  <h4>Discharge Instructions</h4>
                  <p>Activity restricted for 2 weeks. Officially increase activity as returned.</p>
                </div>
                
                <div className="summary-section">
                  <h4>Follow-up Appointments</h4>
                  <ul>
                    <li>Follow-up - July 22, 2024</li>
                    <li>Follow-up - July 23, 2024</li>
                  </ul>
                </div>
                
                <div className="summary-section">
                  <h4>Emergency Contact</h4>
                  <p>(2015) 12-04/07 changed Emergency Lines</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Discharge Form */}
        <div className="right-column">
          <div className="data_card_admit">
            <div className="data_from_admit">
              <h3 className="main_topic_admit">Discharge Petition</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <label className="admit_card_label">Discharge Status:</label>
                  <select
                    name="discharge"
                    className="form_input_columal"
                    value={inputs.discharge || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-section">
                  <label className="admit_card_label">Discharge Date:</label>
                  <input
                    type="date"
                    name="dischargeDate"
                    className="form_input_columal"
                    value={inputs.dischargeDate || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-section">
                  <label className="admit_card_label">Discharge Notes:</label>
                  <textarea
                    name="dischargeNotes"
                    className="form_input_columal textarea-input"
                    value={inputs.dischargeNotes || ""}
                    onChange={handleChange}
                    placeholder="Enter discharge notes and instructions..."
                    rows="4"
                  />
                </div>

                <div className="form-section">
                  <label className="admit_card_label">Follow-up Instructions:</label>
                  <textarea
                    name="followUpInstructions"
                    className="form_input_columal textarea-input"
                    value={inputs.followUpInstructions || ""}
                    onChange={handleChange}
                    placeholder="Enter follow-up instructions..."
                    rows="3"
                  />
                </div>

                <div className="form-section">
                  <label className="admit_card_label">Prescription Upload:</label>
                  <input
                    type="file"
                    name="prescription"
                    className="form_input_columal"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                <div className="button-group">
                  <button type="submit" className="search_btn_admit primary-btn">
                    Save Discharge
                  </button>
                  <button 
                    type="button" 
                    className="search_btn_admit secondary-btn"
                    onClick={() => navigate("/adminAdmit")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DischargeAdmit;