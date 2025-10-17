import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const appointmentData = location.state?.appointmentData;

  const [patientDetails, setPatientDetails] = useState({
    patientID: "",
    name: "",
    assignedDoctor: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // Fetch admit data
      const admitResponse = await axios.get("http://localhost:8081/api/admit");
      setAdmitData(admitResponse.data.admit);
      setFilteredData(admitResponse.data.admit);

      // Fetch rooms data
      const roomsResponse = await axios.get("http://localhost:8081/api/rooms");
      if (roomsResponse.data.rooms.length === 0) {
        // Initialize sample rooms if none exist
        await axios.post("http://localhost:8081/api/rooms/initialize");
        const newRoomsResponse = await axios.get("http://localhost:8081/api/rooms");
        setRooms(newRoomsResponse.data.rooms);
      } else {
        setRooms(roomsResponse.data.rooms);
      }

      setError("");
    } catch (err) {
      console.error("Error initializing data:", err);
      setError("Failed to fetch data. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentData && admitData.length > 0) {
      const existingPatient = admitData.find(
        admit => admit.fullname === appointmentData.fullname && 
        admit.phone === appointmentData.phone
      );
      if (existingPatient) {
        setSelectedPatient(existingPatient._id);
        updatePatientDetails(existingPatient);
      } else {
        // Set patient details from appointment data
        setPatientDetails({
          patientID: appointmentData.doctorAppoimentID || "HF-00123",
          name: appointmentData.fullname || "",
          assignedDoctor: appointmentData.doctorname || "",
          phone: appointmentData.phone || "",
          email: appointmentData.gmail || ""
        });
      }
    }
  }, [admitData, appointmentData]);

  const updatePatientDetails = (patient) => {
    if (patient) {
      setPatientDetails({
        patientID: patient.admitID || patient.patientID || "",
        name: patient.fullname || "",
        assignedDoctor: patient.assignedDoctor || "",
        phone: patient.phone || "",
        email: patient.email || patient.gmail || ""
      });
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = admitData.filter((admit) =>
      Object.values(admit).some((val) =>
        val && val.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  const handleRoomSelect = (roomId) => {
    const room = rooms.find(r => r.roomId === roomId);
    if (room && room.status === "available") {
      setSelectedRoom(roomId);
    }
  };

  const handlePatientSelect = (admitId) => {
    setSelectedPatient(admitId);
    const patient = admitData.find(admit => admit._id === admitId);
    updatePatientDetails(patient);
  };

  const createAdmitFromAppointment = async () => {
    if (!appointmentData) return null;

    try {
      const newAdmit = {
        admitID: `ADM-${Date.now()}`,
        fullname: appointmentData.fullname,
        nic: appointmentData.nic || "Not Provided",
        phone: appointmentData.phone,
        email: appointmentData.gmail,
        assignedDoctor: appointmentData.doctorname,
        status: "Pending Admission",
        roomId: "",
        appointmentData: appointmentData
      };

      const response = await axios.post("http://localhost:8081/api/admit", newAdmit);
      // Update local state
      setAdmitData(prev => [...prev, response.data.admit]);
      setFilteredData(prev => [...prev, response.data.admit]);
      
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
    setSelectedPatient(patientId);
  }

  if (!patientId) {
    alert("Please select a patient");
    return;
  }

  try {
    console.log('Assigning room:', { selectedRoom, patientId });

    // Use the new assign endpoint that handles both room and patient updates
    const response = await axios.post('http://localhost:8081/api/rooms/assign', {
      roomId: selectedRoom,
      patientId: patientId
    });

    if (response.data.success) {
      // Update local state for rooms
      const updatedRooms = rooms.map(room => 
        room.roomId === selectedRoom 
          ? { ...room, status: "occupied", patientId: patientId }
          : room
      );
      setRooms(updatedRooms);

      // Update local state for admit data
      const updatedAdmitData = admitData.map(admit =>
        admit._id === patientId
          ? { ...admit, roomId: selectedRoom, status: "Admitted" }
          : admit
      );
      setAdmitData(updatedAdmitData);
      setFilteredData(updatedAdmitData);

      // Update patient details if this patient is selected
      if (selectedPatient === patientId) {
        const updatedPatient = updatedAdmitData.find(admit => admit._id === patientId);
        if (updatedPatient) {
          setPatientDetails({
            patientID: updatedPatient.admitID,
            name: updatedPatient.fullname,
            assignedDoctor: updatedPatient.assignedDoctor,
            phone: updatedPatient.phone,
            email: updatedPatient.email
          });
        }
      }

      alert(`Room ${selectedRoom} assigned to ${patientDetails.name} successfully!`);
      
      // Reset selections
      setSelectedRoom("");
      setSelectedPatient("");
    } else {
      alert(response.data.error || "Failed to assign room");
    }
    
  } catch (error) {
    console.error("Error assigning room:", error);
    if (error.response && error.response.data) {
      alert(`Failed to assign room: ${error.response.data.error}`);
    } else {
      alert("Failed to assign room. Please check your connection and try again.");
    }
  }
};

// Add this for debugging
useEffect(() => {
  console.log('Current State:', {
    selectedRoom,
    selectedPatient,
    rooms: rooms.length,
    admitData: admitData.length,
    patientDetails
  });
}, [selectedRoom, selectedPatient, rooms, admitData, patientDetails]);

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "#28a745";
      case "occupied": return "#dc3545";
      case "cleaning": return "#ffc107";
      case "maintenance": return "#6c757d";
      default: return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available": return "Available";
      case "occupied": return "Occupied";
      case "cleaning": return "Cleaning";
      case "maintenance": return "Maintenance";
      default: return status;
    }
  };

  const filterRoomsByType = (type) => {
    return rooms.filter(room => room.type === type);
  };

  if (loading) {
    return (
      <div className="room-assignment-container">
        <Navar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-assignment-container">
      <Navar />
      
      <div className="main-container">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
        
        {/* Appointment Information Banner */}
        {appointmentData && (
          <div className="appointment-banner">
            <h3>Appointment Information</h3>
            <div className="appointment-details-grid">
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

        {/* Room Availability Section */}
        <div className="room-availability-section">
          <h2 className="section-title">Room Availability</h2>
          
          {/* Ward Rooms */}
          <div className="room-category">
            <h3>Ward Rooms</h3>
            <div className="room-grid">
              {filterRoomsByType('ward').map(room => (
                <div 
                  key={room.roomId}
                  className={`room-card ${room.status} ${selectedRoom === room.roomId ? 'selected' : ''}`}
                  onClick={() => handleRoomSelect(room.roomId)}
                >
                  <div className="room-id">{room.roomId}</div>
                  <div className="room-type">Ward ({room.capacity} beds)</div>
                  <div 
                    className="room-status" 
                    style={{ color: getStatusColor(room.status) }}
                  >
                    {getStatusText(room.status)}
                  </div>
                  <div className="room-price">RS {room.price}/day</div>
                </div>
              ))}
            </div>
          </div>

          {/* Private Rooms */}
          <div className="room-category">
            <h3>Private Rooms</h3>
            <div className="room-grid">
              {filterRoomsByType('private').map(room => (
                <div 
                  key={room.roomId}
                  className={`room-card ${room.status} ${selectedRoom === room.roomId ? 'selected' : ''}`}
                  onClick={() => handleRoomSelect(room.roomId)}
                >
                  <div className="room-id">{room.roomId}</div>
                  <div className="room-type">Private Room</div>
                  <div 
                    className="room-status" 
                    style={{ color: getStatusColor(room.status) }}
                  >
                    {getStatusText(room.status)}
                  </div>
                  <div className="room-price">RS {room.price}/day</div>
                </div>
              ))}
            </div>
          </div>

          {/* ICU Rooms */}
          <div className="room-category">
            <h3>ICU Rooms</h3>
            <div className="room-grid">
              {filterRoomsByType('icu').map(room => (
                <div 
                  key={room.roomId}
                  className={`room-card ${room.status} ${selectedRoom === room.roomId ? 'selected' : ''}`}
                  onClick={() => handleRoomSelect(room.roomId)}
                >
                  <div className="room-id">{room.roomId}</div>
                  <div className="room-type">ICU</div>
                  <div 
                    className="room-status" 
                    style={{ color: getStatusColor(room.status) }}
                  >
                    {getStatusText(room.status)}
                  </div>
                  <div className="room-price">RS {room.price}/day</div>
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
              placeholder="Search patients by name, phone, NIC, or admit ID..."
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
                      <td>
                        <span className={`status-badge status-${admit.status?.toLowerCase().replace(' ', '-')}`}>
                          {admit.status || "Pending"}
                        </span>
                      </td>
                      <td>{admit.roomId || "Not Assigned"}</td>
                      <td>{admit.assignedDoctor || "Not Assigned"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">No patient records found</td>
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