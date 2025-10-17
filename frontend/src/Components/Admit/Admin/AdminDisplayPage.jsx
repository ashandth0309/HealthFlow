import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Added useLocation and useNavigate
import Navar from "./Navar";
import "./RoomAssignment.css";

function AdminDisplayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [admitData, setAdmitData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [rooms, setRooms] = useState({
    ward: [],
    private: [],
    icu: []
  });

  // Get appointment data from navigation state
  const appointmentData = location.state?.appointmentData;

  // Mock room data
  const initialRooms = {
    ward: [
      { id: "W-101", status: "available", type: "ward" },
      { id: "W-102", status: "occupied", type: "ward" },
      { id: "W-103", status: "available", type: "ward" },
      { id: "W-104", status: "cleaning", type: "ward" },
      { id: "W-105", status: "occupied", type: "ward" },
      { id: "W-106", status: "available", type: "ward" },
      { id: "W-107", status: "occupied", type: "ward" },
      { id: "W-108", status: "available", type: "ward" },
      { id: "W-109", status: "cleaning", type: "ward" },
      { id: "W-110", status: "occupied", type: "ward" },
      { id: "W-111", status: "available", type: "ward" },
      { id: "W-112", status: "available", type: "ward" },
      { id: "W-113", status: "occupied", type: "ward" },
      { id: "W-114", status: "available", type: "ward" },
      { id: "W-115", status: "cleaning", type: "ward" }
    ],
    private: [
      { id: "P-201", status: "available", type: "private" },
      { id: "P-202", status: "occupied", type: "private" },
      { id: "P-203", status: "available", type: "private" },
      { id: "P-204", status: "cleaning", type: "private" },
      { id: "P-205", status: "occupied", type: "private" },
      { id: "P-206", status: "available", type: "private" },
      { id: "P-207", status: "occupied", type: "private" },
      { id: "P-208", status: "available", type: "private" }
    ],
    icu: [
      { id: "I-301", status: "available", type: "icu" },
      { id: "I-302", status: "cleaning", type: "icu" },
      { id: "I-303", status: "occupied", type: "icu" },
      { id: "I-304", status: "available", type: "icu" },
      { id: "I-305", status: "available", type: "icu" }
    ]
  };

  // Initialize patient details with appointment data if available
  const [patientDetails, setPatientDetails] = useState({
    patientID: appointmentData?.doctorAppoimentID || "HF-00123",
    name: appointmentData?.fullname || "Alice Johnson",
    assignedDoctor: appointmentData?.doctorname || "Dr. Emily Davis",
    phone: appointmentData?.phone || "",
    email: appointmentData?.gmail || ""
  });

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
    setRooms(initialRooms);

    // If appointment data exists, auto-select the patient if they exist in admit data
    if (appointmentData) {
      setTimeout(() => {
        const existingPatient = admitData.find(
          admit => admit.fullname === appointmentData.fullname && 
          admit.phone === appointmentData.phone
        );
        if (existingPatient) {
          setSelectedPatient(existingPatient._id);
        }
      }, 1000);
    }
  }, [appointmentData]);

  useEffect(() => {
    if (selectedPatient) {
      const patient = admitData.find(admit => admit._id === selectedPatient);
      if (patient) {
        setPatientDetails({
          patientID: patient.admitID || appointmentData?.doctorAppoimentID || "HF-00123",
          name: patient.fullname || appointmentData?.fullname || "Alice Johnson",
          assignedDoctor: patient.assignedDoctor || appointmentData?.doctorname || "Dr. Emily Davis",
          phone: patient.phone || appointmentData?.phone || "",
          email: patient.email || appointmentData?.gmail || ""
        });
      }
    } else if (appointmentData) {
      // Use appointment data if no patient is selected but appointment data exists
      setPatientDetails({
        patientID: appointmentData.doctorAppoimentID,
        name: appointmentData.fullname,
        assignedDoctor: appointmentData.doctorname,
        phone: appointmentData.phone,
        email: appointmentData.gmail
      });
    }
  }, [selectedPatient, admitData, appointmentData]);

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

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
  };

  const handlePatientSelect = (admitId) => {
    setSelectedPatient(admitId);
  };

  // Function to create new admit record from appointment data
  const createAdmitFromAppointment = async () => {
    if (!appointmentData) return null;

    try {
      const newAdmit = {
        admitID: `ADM-${Date.now()}`,
        fullname: appointmentData.fullname,
        phone: appointmentData.phone,
        gmail: appointmentData.gmail,
        assignedDoctor: appointmentData.doctorname,
        status: "Pending Admission",
        roomId: "",
        date: new Date().toISOString().split('T')[0]
      };

      const response = await axios.post("http://localhost:8081/admit", newAdmit);
      return response.data.admit._id;
    } catch (error) {
      console.error("Error creating admit record:", error);
      return null;
    }
  };

  const assignRoom = async () => {
    if (!selectedRoom) {
      alert("Please select a room");
      return;
    }

    let patientId = selectedPatient;

    // If no patient is selected but we have appointment data, create a new admit record
    if (!patientId && appointmentData) {
      patientId = await createAdmitFromAppointment();
      if (!patientId) {
        alert("Failed to create patient record");
        return;
      }
    }

    if (!patientId) {
      alert("Please select a patient");
      return;
    }

    try {
      const patient = admitData.find(admit => admit._id === patientId) || {
        fullname: appointmentData.fullname,
        assignedDoctor: appointmentData.doctorname
      };

      const updatedRooms = { ...rooms };
      Object.keys(updatedRooms).forEach(type => {
        updatedRooms[type] = updatedRooms[type].map(room => 
          room.id === selectedRoom ? { ...room, status: "occupied", patientId: patientId } : room
        );
      });
      setRooms(updatedRooms);

      await axios.put(`http://localhost:8081/admit/${patientId}`, {
        ...patient,
        roomId: selectedRoom,
        status: "Admitted"
      });

      alert(`Room ${selectedRoom} assigned to ${patient.fullname} successfully!`);
      
      // Refresh admit data
      const response = await axios.get("http://localhost:8081/admit");
      setAdmitData(response.data.admit);
      setFilteredData(response.data.admit);
      
      setSelectedRoom("");
      setSelectedPatient("");
      
    } catch (error) {
      console.error("Error assigning room:", error);
      alert("Failed to assign room");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "green";
      case "occupied": return "red";
      case "cleaning": return "orange";
      default: return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available": return "Available";
      case "occupied": return "Occupied";
      case "cleaning": return "Cleaning";
      default: return status;
    }
  };

  return (
    <div className="room-assignment-container">
      <Navar />
      
      <div className="main-container" style={{ marginLeft: '240px', padding: '20px' }}>
        
        {/* Appointment Information Banner */}
        {appointmentData && (
          <div className="appointment-banner" style={{
            backgroundColor: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>
              Appointment Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div><strong>Patient:</strong> {appointmentData.fullname}</div>
              <div><strong>Appointment ID:</strong> {appointmentData.doctorAppoimentID}</div>
              <div><strong>Doctor:</strong> {appointmentData.doctorname}</div>
              <div><strong>Phone:</strong> {appointmentData.phone}</div>
            </div>
          </div>
        )}

        {/* Patient Details Section */}
        <div className="patient-details-section">
          <h2 className="section-title">Patient Details</h2>
          <div className="patient-details-card">
            <div className="patient-detail-row">
              <span className="patient-detail-label">Patient ID:</span>
              <span className="patient-detail-value">{patientDetails.patientID}</span>
            </div>
            <div className="patient-detail-row">
              <span className="patient-detail-label">Name:</span>
              <span className="patient-detail-value">{patientDetails.name}</span>
            </div>
            <div className="patient-detail-row">
              <span className="patient-detail-label">Phone:</span>
              <span className="patient-detail-value">{patientDetails.phone}</span>
            </div>
            <div className="patient-detail-row">
              <span className="patient-detail-label">Email:</span>
              <span className="patient-detail-value">{patientDetails.email}</span>
            </div>
            <div className="patient-detail-row">
              <span className="patient-detail-label">Assigned Doctor:</span>
              <span className="patient-detail-value">{patientDetails.assignedDoctor}</span>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="room-availability-section">
          <h2 className="section-title">Room Availability</h2>
          
          {/* Ward Rooms */}
          <div className="room-category">
            <h3>Ward Rooms</h3>
            <div className="room-grid">
              {rooms.ward.map(room => (
                <div 
                  key={room.id}
                  className={`room-card ${room.status} ${selectedRoom === room.id ? 'selected' : ''}`}
                  onClick={() => room.status === "available" && handleRoomSelect(room.id)}
                >
                  <div className="room-id">{room.id}</div>
                  <div 
                    className="room-status" 
                    style={{ color: getStatusColor(room.status) }}
                  >
                    {getStatusText(room.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Private Rooms */}
          <div className="room-category">
            <h3>Private Rooms</h3>
            <div className="room-grid">
              {rooms.private.map(room => (
                <div 
                  key={room.id}
                  className={`room-card ${room.status} ${selectedRoom === room.id ? 'selected' : ''}`}
                  onClick={() => room.status === "available" && handleRoomSelect(room.id)}
                >
                  <div className="room-id">{room.id}</div>
                  <div 
                    className="room-status" 
                    style={{ color: getStatusColor(room.status) }}
                  >
                    {getStatusText(room.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ICU Rooms */}
          <div className="room-category">
            <h3>ICU Rooms</h3>
            <div className="room-grid">
              {rooms.icu.map(room => (
                <div 
                  key={room.id}
                  className={`room-card ${room.status} ${selectedRoom === room.id ? 'selected' : ''}`}
                  onClick={() => room.status === "available" && handleRoomSelect(room.id)}
                >
                  <div className="room-id">{room.id}</div>
                  <div 
                    className="room-status" 
                    style={{ color: getStatusColor(room.status) }}
                  >
                    {getStatusText(room.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assign Room Section */}
          <div className="assign-room-section">
            <h3>Assign Room</h3>
            <div className="assignment-info">
              <div className="selection-display">
                <p><strong>Selected Room:</strong> {selectedRoom || "None"}</p>
                <p><strong>Selected Patient:</strong> {selectedPatient ? admitData.find(a => a._id === selectedPatient)?.fullname : patientDetails.name}</p>
              </div>
              <button 
                className="assign-btn"
                onClick={assignRoom}
                disabled={!selectedRoom}
              >
                Assign Room
              </button>
            </div>
          </div>
        </div>

        {/* Patient Records Table */}
        <div className="patient-records-section">
          <h2 className="section-title">Patient Records</h2>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              className="search-input"
              onChange={handleSearch}
            />
          </div>
          
          <div className="table-container">
            <table className="admit-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Admit ID</th>
                  <th>Full Name</th>
                  <th>NIC</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Room Assigned</th>
                  <th>Assigned Doctor</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((admit) => (
                    <tr 
                      key={admit._id} 
                      className={selectedPatient === admit._id ? 'selected-patient' : ''}
                      onClick={() => handlePatientSelect(admit._id)}
                    >
                      <td>
                        <input
                          type="radio"
                          name="patientSelect"
                          checked={selectedPatient === admit._id}
                          onChange={() => handlePatientSelect(admit._id)}
                        />
                      </td>
                      <td>{admit.admitID}</td>
                      <td>{admit.fullname}</td>
                      <td>{admit.nic}</td>
                      <td>{admit.phone}</td>
                      <td>{admit.status || "Pending"}</td>
                      <td>{admit.roomId || "Not Assigned"}</td>
                      <td>{admit.assignedDoctor || "Not Assigned"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No records found</td>
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

export default AdminDisplayPage;