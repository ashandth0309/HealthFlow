/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import Navar from "./Navar";
import "./DischargeAdmit.css";

function DischargeAdmit() {
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [inputs, setInputs] = useState({
    dischargePlanning: {
      medicalSummary: '',
      medications: '',
      instructions: '',
      followUp: ''
    },
    dischargeSummary: {
      admissionDate: '',
      primaryDiagnosis: '',
      treatmentProvided: '',
      dischargeMedications: ''
    },
    dischargeInstructions: {
      activityRestrictions: '',
      dietInstructions: '',
      followUpAppointments: 'Follow-up - July 22, 2024\nFollow-up - July 23, 2024',
      emergencyContact: '(555) 123-4567 (Hospital Emergency Line)'
    },
    roomReleaseStatus: 'Not Released'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch admitted patients
  useEffect(() => {
    fetchAdmittedPatients();
  }, []);

  // If URL has patient ID, load that patient
  useEffect(() => {
    if (id) {
      loadPatientData(id);
    }
  }, [id]);

  const fetchAdmittedPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/admit/status/admitted');
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      alert("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const loadPatientData = async (patientId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/admit/${patientId}`);
      const data = response.data.admit;
      
      setSelectedPatient(data);
      
      // Merge existing data with inputs
      setInputs(prev => ({
        ...prev,
        dischargePlanning: {
          ...prev.dischargePlanning,
          ...(data.dischargePlanning || {})
        },
        dischargeSummary: {
          ...prev.dischargeSummary,
          ...(data.dischargeSummary || {}),
          admissionDate: data.date ? new Date(data.date).toISOString().split('T')[0] : ''
        },
        dischargeInstructions: {
          ...prev.dischargeInstructions,
          ...(data.dischargeInstructions || {})
        },
        roomReleaseStatus: data.roomReleaseStatus || 'Not Released'
      }));
      
      setActiveTab("planning");
    } catch (error) {
      console.error("Error loading patient data:", error);
      alert("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  const handleDischargePatient = (patient) => {
    setSelectedPatient(patient);
    setActiveTab("planning");
    navigate(`/discharge/${patient._id}`, { replace: true });
  };

  const handleNestedChange = (section, field, value) => {
    setInputs(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveDischargePlanning = async () => {
    if (!selectedPatient) return;
    
    try {
      const response = await axios.put(`http://localhost:8081/api/admit/${selectedPatient._id}/discharge`, {
        dischargePlanning: inputs.dischargePlanning,
        dischargeSummary: inputs.dischargeSummary,
        dischargeInstructions: inputs.dischargeInstructions,
        dischargeDate: new Date().toISOString().split('T')[0]
      });

      if (response.data.success) {
        alert("Discharge planning saved successfully!");
        setSelectedPatient(response.data.admit);
      }
    } catch (error) {
      console.error("Error saving discharge planning:", error);
      alert("Error saving discharge planning: " + (error.response?.data?.error || error.message));
    }
  };

  const handleFinalizeDischarge = async () => {
    if (!selectedPatient) return;
    
    try {
      // First confirm the discharge
      const confirmDischarge = window.confirm(
        `Are you sure you want to discharge ${selectedPatient.fullname}?\n\nThis will:\n• Mark the patient as discharged\n• Release room ${selectedPatient.roomId || 'N/A'} for new patients\n• Remove patient from admitted list`
      );

      if (!confirmDischarge) return;

      const response = await axios.put(`http://localhost:8081/api/admit/${selectedPatient._id}/finalize-discharge`, {
        roomReleaseStatus: inputs.roomReleaseStatus
      });

      if (response.data.success) {
        alert(`Discharge finalized successfully!\n\n${selectedPatient.fullname} has been discharged.\n${selectedPatient.roomId ? `Room ${selectedPatient.roomId} is now available.` : 'No room was assigned.'}`);
        
        // Refresh patient list and reset state
        await fetchAdmittedPatients();
        setSelectedPatient(null);
        setActiveTab("patients");
        navigate('/discharge', { replace: true });
      }
    } catch (error) {
      console.error("Error finalizing discharge:", error);
      alert("Error finalizing discharge: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDeletePatient = async (patientId, patientName) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to permanently delete ${patientName} from the system?\n\nThis action cannot be undone and will also release their room if assigned.`
      );

      if (!confirmDelete) return;

      const response = await axios.delete(`http://localhost:8081/api/admit/${patientId}`);

      if (response.data.success) {
        alert(`Patient ${patientName} deleted successfully!`);
        await fetchAdmittedPatients();
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Error deleting patient: " + (error.response?.data?.error || error.message));
    }
  };

  const handleGenerateSummary = () => {
    setActiveTab("aftercare");
  };

  const handlePrintSummary = () => {
    const printContent = document.getElementById('discharge-summary-content');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleBackToPatients = () => {
    setActiveTab("patients");
    setSelectedPatient(null);
    navigate('/discharge', { replace: true });
  };

  if (loading) {
    return (
      <div className="discharge-container">
        <Navar />
        <div className="main-content" style={{ marginLeft: '240px' }}>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="discharge-container">
      <Navar />
      
      <div className="main-content" style={{ marginLeft: '240px' }}>
        {/* Tabs */}
        <div className="discharge-tabs">
          <button 
            className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            Patients List
          </button>
          <button 
            className={`tab-button ${activeTab === 'planning' ? 'active' : ''}`}
            onClick={() => selectedPatient && setActiveTab('planning')}
            disabled={!selectedPatient}
          >
            Discharge Planning
          </button>
          <button 
            className={`tab-button ${activeTab === 'aftercare' ? 'active' : ''}`}
            onClick={() => selectedPatient && setActiveTab('aftercare')}
            disabled={!selectedPatient}
          >
            Discharge Summary
          </button>
        </div>

        {/* PATIENTS LIST TAB */}
        {activeTab === "patients" && (
          <div className="patients-tab">
            <div className="tab-header">
              <h1>Admitted Patients</h1>
              <p>Select a patient to begin discharge process</p>
            </div>

            <div className="patients-grid">
              {patients.length > 0 ? (
                patients.map(patient => (
                  <div key={patient._id} className="patient-card">
                    <div className="patient-info">
                      <div className="patient-avatar">
                        {patient.fullname?.charAt(0) || 'P'}
                      </div>
                      <div className="patient-details">
                        <h3>{patient.fullname || 'Unknown Patient'}</h3>
                        <div className="patient-meta">
                          <span className="meta-item">
                            <strong>ID:</strong> {patient.admitID || 'N/A'}
                          </span>
                          <span className="meta-item">
                            <strong>Room:</strong> {patient.roomId || 'Not Assigned'}
                          </span>
                          <span className="meta-item">
                            <strong>Doctor:</strong> {patient.assignedDoctor || 'N/A'}
                          </span>
                          <span className="meta-item">
                            <strong>Admitted:</strong> {patient.date ? new Date(patient.date).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className={`status-badge status-${patient.status?.toLowerCase().replace(' ', '-')}`}>
                          {patient.status || 'Unknown'}
                        </div>
                      </div>
                    </div>
                    <div className="patient-actions">
                      <button 
                        className="btn-discharge"
                        onClick={() => handleDischargePatient(patient)}
                      >
                        Start Discharge
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeletePatient(patient._id, patient.fullname)}
                        title="Delete patient record"
                      >
                        
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-patients">
                  <div className="no-patients-icon"></div>
                  <h3>No Admitted Patients</h3>
                  <p>There are currently no patients admitted to the hospital.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DISCHARGE PLANNING TAB */}
        {activeTab === "planning" && selectedPatient && (
          <div className="discharge-planning-tab">
            {/* Header Section */}
            <div className="planning-header-section">
              <div className="header-card">
                <div className="header-top">
                  <button className="back-button" onClick={handleBackToPatients}>
                    ← Back to Patients
                  </button>
                  <h1>Discharge Planning</h1>
                </div>
                <div className="patient-header-info">
                  <div className="patient-badge">
                    <span className="label">Patient:</span>
                    <span className="value">{selectedPatient.fullname || "Unknown Patient"}</span>
                  </div>
                  <div className="patient-badge">
                    <span className="label">Patient ID:</span>
                    <span className="value">{selectedPatient.admitID || "N/A"}</span>
                  </div>
                  <div className="patient-badge">
                    <span className="label">Room:</span>
                    <span className="value">{selectedPatient.roomId || "Not Assigned"}</span>
                  </div>
                  <div className="patient-badge">
                    <span className="label">Discharge Date:</span>
                    <span className="value">
                      <input
                        type="date"
                        className="date-input"
                        value={inputs.dischargeDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setInputs(prev => ({...prev, dischargeDate: e.target.value}))}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Overview Boxes */}
            <div className="overview-boxes-grid">
              <div className="overview-box medical-summary">
                <div className="box-icon"></div>
                <h3>Medical Summary</h3>
                <div className="box-content">
                  <textarea
                    value={inputs.dischargePlanning.medicalSummary}
                    onChange={(e) => handleNestedChange('dischargePlanning', 'medicalSummary', e.target.value)}
                    placeholder="Enter medical summary..."
                    className="box-textarea"
                  />
                </div>
              </div>

              <div className="overview-box medications">
                <div className="box-icon"></div>
                <h3>Medications</h3>
                <div className="box-content">
                  <textarea
                    value={inputs.dischargePlanning.medications}
                    onChange={(e) => handleNestedChange('dischargePlanning', 'medications', e.target.value)}
                    placeholder="List medications..."
                    className="box-textarea"
                  />
                </div>
              </div>

              <div className="overview-box instructions">
                <div className="box-icon"></div>
                <h3>Instructions</h3>
                <div className="box-content">
                  <textarea
                    value={inputs.dischargePlanning.instructions}
                    onChange={(e) => handleNestedChange('dischargePlanning', 'instructions', e.target.value)}
                    placeholder="Enter instructions..."
                    className="box-textarea"
                  />
                </div>
              </div>

              <div className="overview-box follow-up">
                <div className="box-icon"></div>
                <h3>Follow-up</h3>
                <div className="box-content">
                  <textarea
                    value={inputs.dischargePlanning.followUp}
                    onChange={(e) => handleNestedChange('dischargePlanning', 'followUp', e.target.value)}
                    placeholder="Schedule follow-up..."
                    className="box-textarea"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="planning-main-grid">
              {/* Left Column - Discharge Summary */}
              <div className="planning-column left-column">
                <div className="content-card">
                  <div className="card-header">
                    <h2>Discharge Summary</h2>
                    <div className="card-divider"></div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Admission Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={inputs.dischargeSummary.admissionDate}
                      onChange={(e) => handleNestedChange('dischargeSummary', 'admissionDate', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Diagnosis</label>
                    <textarea
                      className="form-textarea"
                      value={inputs.dischargeSummary.primaryDiagnosis}
                      onChange={(e) => handleNestedChange('dischargeSummary', 'primaryDiagnosis', e.target.value)}
                      placeholder="Enter primary diagnosis..."
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Treatment Provided</label>
                    <textarea
                      className="form-textarea"
                      value={inputs.dischargeSummary.treatmentProvided}
                      onChange={(e) => handleNestedChange('dischargeSummary', 'treatmentProvided', e.target.value)}
                      placeholder="Describe treatment provided..."
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Discharge Medications</label>
                    <textarea
                      className="form-textarea"
                      value={inputs.dischargeSummary.dischargeMedications}
                      onChange={(e) => handleNestedChange('dischargeSummary', 'dischargeMedications', e.target.value)}
                      placeholder="List discharge medications..."
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Discharge Instructions */}
              <div className="planning-column right-column">
                <div className="content-card">
                  <div className="card-header">
                    <h2>Discharge Instructions</h2>
                    <div className="card-divider"></div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Activity Restrictions</label>
                    <textarea
                      className="form-textarea"
                      value={inputs.dischargeInstructions.activityRestrictions}
                      onChange={(e) => handleNestedChange('dischargeInstructions', 'activityRestrictions', e.target.value)}
                      placeholder="Describe activity restrictions..."
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Diet Instructions</label>
                    <textarea
                      className="form-textarea"
                      value={inputs.dischargeInstructions.dietInstructions}
                      onChange={(e) => handleNestedChange('dischargeInstructions', 'dietInstructions', e.target.value)}
                      placeholder="Provide diet instructions..."
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Follow-up Appointments</label>
                    <textarea
                      className="form-textarea"
                      value={inputs.dischargeInstructions.followUpAppointments}
                      onChange={(e) => handleNestedChange('dischargeInstructions', 'followUpAppointments', e.target.value)}
                      placeholder="List follow-up appointments..."
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Contact</label>
                    <input
                      type="text"
                      className="form-input"
                      value={inputs.dischargeInstructions.emergencyContact}
                      onChange={(e) => handleNestedChange('dischargeInstructions', 'emergencyContact', e.target.value)}
                      placeholder="Emergency contact number"
                    />
                  </div>

                  <div className="action-buttons">
                    <button 
                      className="btn-primary generate-btn"
                      onClick={handleGenerateSummary}
                    >
                      Generate Summary
                    </button>
                    <button className="btn-secondary">
                      Schedule Follow-up
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Section */}
            <div className="save-section">
              <button 
                className="btn-save-large"
                onClick={handleSaveDischargePlanning}
              >
                Save Discharge Planning
              </button>
            </div>
          </div>
        )}

        {/* DISCHARGE SUMMARY TAB */}
        {activeTab === "aftercare" && selectedPatient && (
          <div className="aftercare-tab">
            {/* Action Buttons */}
            <div className="summary-actions">
              <button className="back-button" onClick={() => setActiveTab('planning')}>
                ← Back to Planning
              </button>
              <div className="action-buttons-right">
                <button 
                  className="btn-primary finalize-btn"
                  onClick={handleFinalizeDischarge}
                >
                  Finalize Discharge & Release Room
                </button>
                <button 
                  className="btn-secondary print-btn"
                  onClick={handlePrintSummary}
                >
                  Print Summary
                </button>
              </div>
            </div>

            {/* Professional Hospital Discharge Summary */}
            <div id="discharge-summary-content" className="discharge-summary-document">
              {/* Hospital Header */}
              <div className="hospital-header">
                <div className="hospital-logo">
                  <div className="logo-placeholder"></div>
                  <div className="hospital-info">
                    <h1>HealthFlow Medical Center</h1>
                    <p>123 Healthcare Drive, Medical City, MC 12345</p>
                    <p>Phone: (555) 123-HEAL | www.healthflowmedical.com</p>
                  </div>
                </div>
                <div className="document-title">
                  <h2>DISCHARGE SUMMARY</h2>
                  <div className="document-line"></div>
                </div>
              </div>

              {/* Patient Information Section */}
              <div className="patient-info-section">
                <h3>PATIENT INFORMATION</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Patient Name:</span>
                    <span className="info-value">{selectedPatient.fullname || "Not Provided"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Patient ID:</span>
                    <span className="info-value">{selectedPatient.admitID || "Not Provided"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date of Admission:</span>
                    <span className="info-value">
                      {inputs.dischargeSummary.admissionDate || 
                       (selectedPatient.date ? new Date(selectedPatient.date).toLocaleDateString() : "Not Provided")}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date of Discharge:</span>
                    <span className="info-value">{inputs.dischargeDate || new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Attending Physician:</span>
                    <span className="info-value">{selectedPatient.assignedDoctor || "Not Assigned"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Room Number:</span>
                    <span className="info-value">{selectedPatient.roomId || "Not Assigned"}</span>
                  </div>
                </div>
              </div>

              {/* Medical Information Sections */}
              <div className="summary-sections">
                {/* Primary Diagnosis */}
                <div className="summary-section">
                  <h3>PRIMARY DIAGNOSIS</h3>
                  <div className="section-content">
                    {inputs.dischargeSummary.primaryDiagnosis || "No primary diagnosis recorded."}
                  </div>
                </div>

                {/* Treatment Provided */}
                <div className="summary-section">
                  <h3>TREATMENT PROVIDED</h3>
                  <div className="section-content">
                    {inputs.dischargeSummary.treatmentProvided || "No treatment details recorded."}
                  </div>
                </div>

                {/* Medical Summary */}
                <div className="summary-section">
                  <h3>MEDICAL SUMMARY</h3>
                  <div className="section-content">
                    {inputs.dischargePlanning.medicalSummary || "No medical summary provided."}
                  </div>
                </div>

                {/* Discharge Medications */}
                <div className="summary-section">
                  <h3>DISCHARGE MEDICATIONS</h3>
                  <div className="section-content">
                    {inputs.dischargeSummary.dischargeMedications ? (
                      <div className="medications-list">
                        {inputs.dischargeSummary.dischargeMedications.split('\n').map((med, index) => (
                          <div key={index} className="medication-item">
                            • {med}
                          </div>
                        ))}
                      </div>
                    ) : (
                      "No discharge medications prescribed."
                    )}
                  </div>
                </div>

                {/* Discharge Instructions */}
                <div className="summary-section">
                  <h3>DISCHARGE INSTRUCTIONS</h3>
                  <div className="instructions-grid">
                    <div className="instruction-category">
                      <h4>Activity Restrictions</h4>
                      <div className="instruction-content">
                        {inputs.dischargeInstructions.activityRestrictions || "No specific activity restrictions."}
                      </div>
                    </div>
                    <div className="instruction-category">
                      <h4>Diet Instructions</h4>
                      <div className="instruction-content">
                        {inputs.dischargeInstructions.dietInstructions || "No specific diet instructions."}
                      </div>
                    </div>
                    <div className="instruction-category">
                      <h4>Follow-up Appointments</h4>
                      <div className="instruction-content">
                        {inputs.dischargeInstructions.followUpAppointments ? (
                          <div className="appointments-list">
                            {inputs.dischargeInstructions.followUpAppointments.split('\n').map((appt, index) => (
                              <div key={index} className="appointment-item">
                                • {appt}
                              </div>
                            ))}
                          </div>
                        ) : (
                          "No follow-up appointments scheduled."
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Instructions */}
                <div className="summary-section">
                  <h3>ADDITIONAL INSTRUCTIONS</h3>
                  <div className="section-content">
                    {inputs.dischargePlanning.instructions || "No additional instructions provided."}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="summary-section">
                  <h3>EMERGENCY CONTACT INFORMATION</h3>
                  <div className="section-content emergency-contact">
                    <strong>Hospital Emergency Line:</strong> {inputs.dischargeInstructions.emergencyContact}<br/>
                    <strong>Available 24/7 for medical emergencies</strong>
                  </div>
                </div>
              </div>

              {/* Footer and Signatures */}
              <div className="document-footer">
                <div className="signature-section">
                  <div className="signature-line"></div>
                  <p>Attending Physician Signature</p>
                </div>
                <div className="signature-section">
                  <div className="signature-line"></div>
                  <p>Patient/Parent/Guardian Signature</p>
                </div>
                <div className="footer-note">
                  <p><strong>Important:</strong> This discharge summary is provided for informational purposes only. 
                  Please follow up with your primary care physician and contact emergency services for any medical emergencies.</p>
                </div>
              </div>
            </div>

            {/* Room Release Section (Not part of printed document) */}
            <div className="room-release-section no-print">
              <h3>Room Release Status</h3>
              <select 
                className="form-input status-select"
                value={inputs.roomReleaseStatus}
                onChange={(e) => setInputs(prev => ({...prev, roomReleaseStatus: e.target.value}))}
              >
                <option value="Not Released">Not Released</option>
                <option value="Cleaning In Progress">Cleaning In Progress</option>
                <option value="Ready for New Patient">Ready for New Patient</option>
                <option value="Released">Released</option>
              </select>
              {selectedPatient.roomId && (
                <p className="room-info">
                  Room <strong>{selectedPatient.roomId}</strong> will be released upon discharge
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DischargeAdmit;