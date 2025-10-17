import axios from "axios";
import { useState, useEffect } from "react";
import HomeNav from "../Home/HomeNav";
import { IoTime } from "react-icons/io5";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaStethoscope, FaUserMd } from "react-icons/fa";
import NotFound from "./img/nofound.png";

const URL_SESSIONS = "http://localhost:8081/session";
const URL_APPOINTMENTS = "http://localhost:8081/doctorAppointment";

const fetchHandler = async () => {
  return await axios.get(URL_SESSIONS).then((res) => res.data);
};

const fetchAppointments = async () => {
  return await axios.get(URL_APPOINTMENTS).then((res) => res.data.dappoiment);
};

function SessionDetails() {
  const [session, setSession] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [date, setDate] = useState("");
  const [isAdvancedSearchEnabled, setIsAdvancedSearchEnabled] = useState(false);
  const [doctorSuggestions, setDoctorSuggestions] = useState([]);
  const [draggedDoctor, setDraggedDoctor] = useState(null);
  const [doctorCards, setDoctorCards] = useState([]);

  // Dummy doctor data with specialties
  const dummyDoctors = [
    { 
      doctorname: "John Smith", 
      speciality: "Cardiologist", 
      experience: "15+ years", 
      rating: "4.9",
      description: "Expert in heart diseases and cardiovascular surgery"
    },
    { 
      doctorname: "Sarah Johnson", 
      speciality: "Dermatologist", 
      experience: "10+ years", 
      rating: "4.8",
      description: "Specialized in skin conditions and cosmetic dermatology"
    },
    { 
      doctorname: "Michael Brown", 
      speciality: "Pediatrician", 
      experience: "12+ years", 
      rating: "4.7",
      description: "Children's health specialist with gentle approach"
    },
    { 
      doctorname: "Emily Davis", 
      speciality: "Neurologist", 
      experience: "8+ years", 
      rating: "4.9",
      description: "Brain and nervous system disorders expert"
    },
    { 
      doctorname: "Robert Wilson", 
      speciality: "Orthopedic", 
      experience: "20+ years", 
      rating: "4.8",
      description: "Bone and joint surgery specialist"
    },
    { 
      doctorname: "Lisa Anderson", 
      speciality: "Gynecologist", 
      experience: "14+ years", 
      rating: "4.9",
      description: "Women's health and reproductive specialist"
    },
    { 
      doctorname: "David Miller", 
      speciality: "Psychiatrist", 
      experience: "11+ years", 
      rating: "4.7",
      description: "Mental health and therapy expert"
    },
    { 
      doctorname: "Jennifer Lee", 
      speciality: "Dentist", 
      experience: "9+ years", 
      rating: "4.8",
      description: "Oral health and dental surgery specialist"
    }
  ];

  useEffect(() => {
    fetchHandler().then(async (data) => {
      let sessionsData = data.session || [];
      
      // If no sessions from API, create dummy sessions
      if (sessionsData.length === 0) {
        sessionsData = generateDummySessions();
      }
      
      setSession(sessionsData);
      setFilteredSessions(sessionsData);
      
      const uniqueLocations = Array.from(
        new Set(sessionsData.map((item) => item.location))
      );
      setLocations(uniqueLocations);

      // Get unique doctor names for suggestions
      const uniqueDoctors = Array.from(
        new Set(sessionsData.map((item) => item.doctorname))
      );
      setDoctorSuggestions(uniqueDoctors);

      // Create doctor cards with specialties from dummy data
      const uniqueDoctorCards = [];
      dummyDoctors.forEach((doctor) => {
        uniqueDoctorCards.push({
          doctorname: doctor.doctorname,
          speciality: doctor.speciality,
          experience: doctor.experience,
          rating: doctor.rating,
          description: doctor.description
        });
      });
      setDoctorCards(uniqueDoctorCards);

      // Fetch appointments and adjust seat counts
      try {
        const appointments = await fetchAppointments();
        const updatedSessions = sessionsData.map((s) => {
          const relatedAppointments = appointments.filter(
            (a) =>
              a.session === s.sessionname &&
              a.date === s.date &&
              a.location === s.location &&
              a.doctorname === s.doctorname
          );
          return {
            ...s,
            seatcount: s.seatcount - relatedAppointments.length,
          };
        });
        setFilteredSessions(updatedSessions);
      } catch (error) {
        console.log("Error fetching appointments, using session data as is");
      }
    });
  }, []);

  // Generate dummy sessions data
  const generateDummySessions = () => {
    const sessions = [];
    const locations = ["Colombo General Hospital", "Kandy Medical Center", "Galle City Hospital", "Negombo Health Center"];
    const timeslots = [
      [{ starttime: "09:00", endtime: "11:00" }],
      [{ starttime: "14:00", endtime: "16:00" }],
      [{ starttime: "10:00", endtime: "12:00" }]
    ];
    
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    dummyDoctors.forEach((doctor, index) => {
      for (let i = 0; i < 2; i++) {
        sessions.push({
          sessionname: `${doctor.speciality} Consultation Session ${i + 1}`,
          doctorname: doctor.doctorname,
          speciality: doctor.speciality,
          location: locations[Math.floor(Math.random() * locations.length)],
          date: dates[Math.floor(Math.random() * dates.length)],
          seatcount: Math.floor(Math.random() * 20) + 10,
          price: Math.floor(Math.random() * 2000) + 1000,
          timeslots: timeslots[Math.floor(Math.random() * timeslots.length)]
        });
      }
    });

    return sessions;
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, doctorName) => {
    setDraggedDoctor(doctorName);
    e.dataTransfer.setData("text/plain", doctorName);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedDoctor) {
      setDoctorName(draggedDoctor);
      setDraggedDoctor(null);
      // Auto-search when doctor is dropped
      setTimeout(() => {
        handleSearch();
      }, 100);
    }
  };

  // Click handler for doctor cards - navigate directly to appointment
  const handleDoctorCardClick = (doctorName, speciality) => {
    // Find available sessions for this doctor
    const doctorSessions = session.filter(item => 
      item.doctorname === doctorName && item.speciality === speciality
    );

    if (doctorSessions.length > 0) {
      // Get the first available session
      const firstSession = doctorSessions[0];
      
      const sessionDetails = {
        sessionname: firstSession.sessionname,
        date: firstSession.date,
        doctorname: firstSession.doctorname,
        location: firstSession.location,
        price: firstSession.price,
        timeslot: firstSession.timeslots[0],
        speciality: firstSession.speciality
      };

      localStorage.setItem("sessionDetails", JSON.stringify(sessionDetails));
      window.location.href = "/appointmentselect";
    } else {
      // If no sessions found, still navigate with doctor info
      const sessionDetails = {
        doctorname: doctorName,
        speciality: speciality,
        sessionname: `${speciality} Consultation`,
        date: new Date().toISOString().split('T')[0],
        location: "Main Hospital",
        price: 1500,
        timeslot: { starttime: "10:00", endtime: "12:00" }
      };

      localStorage.setItem("sessionDetails", JSON.stringify(sessionDetails));
      window.location.href = "/appointmentselect";
    }
  };

  const handleKeyDown = (e) => {
    if (
      (e.key >= "0" && e.key <= "9") ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      e.preventDefault();
    }
  };

  const handleSearch = () => {
    let filtered = session.filter((item) => {
      const matchesDoctorName = doctorName
        ? item.doctorname?.toLowerCase().includes(doctorName.toLowerCase())
        : true;
      const matchesLocation = selectedLocation
        ? item.location?.toLowerCase().includes(selectedLocation.toLowerCase())
        : true;
      const matchesSpeciality = speciality
        ? item.speciality?.toLowerCase().includes(speciality.toLowerCase())
        : true;
      const matchesDate = date ? item.date === date : true;

      return (
        matchesDoctorName && matchesLocation && matchesDate && matchesSpeciality
      );
    });
    setFilteredSessions(filtered);
  };

  const handleToggle = () => {
    setIsAdvancedSearchEnabled(!isAdvancedSearchEnabled);
  };

  const clearSearch = () => {
    setDoctorName("");
    setSelectedLocation("");
    setSpeciality("");
    setDate("");
    setFilteredSessions(session);
  };

  return (
    <div>
      <HomeNav />
      <div className="main_doctor_staf home_bk_session">
        <h1 className="topic_admin_session">Book Your Session</h1>
        
        {/* Doctor Cards Section */}
        <div className="doctor-cards-section">
          <h3 className="section-subtitle">Our Specialist Doctors</h3>
          <p className="section-description">Click on any doctor to book appointment directly</p>
          <div className="doctor-cards-container">
            {doctorCards.map((doctor, index) => (
              <div
                key={index}
                className="doctor-card"
                onClick={() => handleDoctorCardClick(doctor.doctorname, doctor.speciality)}
                title={`Click to book appointment with Dr. ${doctor.doctorname}`}
              >
                <div className="doctor-card-header">
                  <div className="doctor-avatar">
                    <FaUserMd />
                  </div>
                  <div className="doctor-info">
                    <h4 className="doctor-name">Dr. {doctor.doctorname}</h4>
                    <p className="doctor-speciality">
                      <FaStethoscope className="speciality-icon" />
                      {doctor.speciality}
                    </p>
                    <p className="doctor-description">{doctor.description}</p>
                  </div>
                </div>
                <div className="doctor-card-footer">
                  <span className="doctor-rating">⭐ {doctor.rating}</span>
                  <span className="doctor-experience">📅 {doctor.experience}</span>
                </div>
                <div className="click-hint">Click to Book</div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Suggestions Drag Area */}
        <div className="doctor-suggestions-container">
          <h3 className="suggestions-title">Quick Search - Drag Doctors to Search Box</h3>
          <div className="doctor-suggestions-list">
            {doctorSuggestions.map((doctor, index) => (
              <div
                key={index}
                className="doctor-suggestion-item"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, doctor)}
                title={`Drag "${doctor}" to search box`}
              >
                👨‍⚕️ {doctor}
              </div>
            ))}
          </div>
        </div>

        <div className="session_card_container">
          <div className="session_card">
            <div className="basic_search data_card_sessionn">
              <div className="data_card_session_new">
                {/* Search Input with Drop Zone */}
                <div 
                  className="search-input-container"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    className={`searcch_input ${draggedDoctor ? 'drop-zone' : ''}`}
                    placeholder="Enter Dr. Name or Drag a Doctor from above"
                    type="text"
                    value={doctorName}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                  {draggedDoctor && (
                    <div className="drag-hint">Drop here to search for {draggedDoctor}</div>
                  )}
                </div>

                {isAdvancedSearchEnabled && (
                  <div className="advance_search data_card_session_new">
                    <select
                      className="searcch_input"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">Select Location</option>
                      {locations.map((location, index) => (
                        <option key={index} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>

                    <input
                      className="searcch_input"
                      placeholder="Enter Date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <input
                      className="searcch_input"
                      placeholder="Specialization"
                      type="text"
                      value={speciality}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => setSpeciality(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="advacne_serch_controle">
                <button onClick={handleSearch} className="search_btn">
                  Search
                </button>
                <button onClick={clearSearch} className="clear_btn">
                  Clear
                </button>
                <div className="advanced-toggle">
                  <input
                    type="checkbox"
                    id="advancedToggle"
                    checked={isAdvancedSearchEnabled}
                    onChange={handleToggle}
                  />
                  <label htmlFor="advancedToggle">Advanced Search</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {doctorName || speciality || selectedLocation || date ? (
          <div className="search-results-header">
            <h3>
              Search Results {filteredSessions.length > 0 ? `(${filteredSessions.length} sessions found)` : ''}
            </h3>
            {doctorName && <span className="search-tag">Doctor: {doctorName}</span>}
            {speciality && <span className="search-tag">Speciality: {speciality}</span>}
            {selectedLocation && <span className="search-tag">Location: {selectedLocation}</span>}
            {date && <span className="search-tag">Date: {date}</span>}
          </div>
        ) : null}

        <div className="session_card_container">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((item, index) => (
              <div className="session_card" key={index}>
                <div className="session_flex">
                  <div>
                    <div className="session_card_item_name">
                      {item.sessionname}
                    </div>
                    <div className="session_card_item">
                      <strong>
                        Session By Dr.{item.doctorname}{" "}
                        <span className="speci">({item.speciality} )</span>
                      </strong>
                    </div>
                    <div className="session_card_item">
                      <strong>Address:</strong> {item.location}
                    </div>
                    <div className="session_card_item">
                      <strong>Seat Count:</strong> {item.seatcount}
                    </div>
                    <div className="session_card_item">
                      <strong>Charges:</strong> Rs.{item.price}.00
                    </div>
                    <button
                      className="book_btn_session"
                      onClick={() => {
                        const sessionDetails = {
                          sessionname: item.sessionname,
                          date: item.date,
                          doctorname: item.doctorname,
                          location: item.location,
                          price: item.price,
                          timeslot: item.timeslots[0],
                          speciality: item.speciality
                        };

                        localStorage.setItem(
                          "sessionDetails",
                          JSON.stringify(sessionDetails)
                        );

                        window.location.href = "/appointmentselect";
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                  <div>
                    <div className="session_card_item_flex_data date_session">
                      <BsCalendarDateFill />
                      {item.date}
                    </div>
                    <div className="session_card_item">
                      {item.timeslots.map((slot, index) => (
                        <span
                          className="session_card_item_flex_data time_session"
                          key={index}
                        >
                          <IoTime /> {slot.starttime} - {slot.endtime}
                          <br />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="not_found_box">
              <img src={NotFound} alt="noimg" className="notfound" />
              <p className="nodata_pera">No Sessions Found</p>
              <p className="nodata_subtext">Try selecting a different doctor or search criteria</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .doctor-cards-section {
          margin: 30px 0;
          padding: 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          color: white;
        }

        .section-subtitle {
          text-align: center;
          margin-bottom: 10px;
          font-size: 24px;
          font-weight: bold;
        }

        .section-description {
          text-align: center;
          margin-bottom: 20px;
          opacity: 0.9;
          font-size: 14px;
        }

        .doctor-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .doctor-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 3px solid transparent;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .doctor-card:hover {
          transform: translateY(-5px);
          border-color: #007bff;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .doctor-card-header {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .doctor-avatar {
          width: 50px;
          height: 50px;
          background: #007bff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          color: white;
          font-size: 20px;
          flex-shrink: 0;
        }

        .doctor-info {
          flex: 1;
        }

        .doctor-name {
          margin: 0 0 5px 0;
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
        }

        .doctor-speciality {
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7f8c8d;
          font-size: 14px;
          font-weight: bold;
        }

        .doctor-description {
          margin: 0;
          font-size: 12px;
          color: #95a5a6;
          line-height: 1.4;
        }

        .speciality-icon {
          color: #e74c3c;
        }

        .doctor-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1px solid #ecf0f1;
        }

        .doctor-rating,
        .doctor-experience {
          font-size: 12px;
          color: #95a5a6;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .click-hint {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #28a745;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
        }

        .search-results-header {
          margin: 20px 0;
          padding: 15px;
          background: #e8f4fd;
          border-radius: 10px;
          border-left: 4px solid #007bff;
        }

        .search-results-header h3 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .search-tag {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 5px 12px;
          border-radius: 15px;
          margin: 5px 8px 5px 0;
          font-size: 12px;
          font-weight: bold;
        }

        .doctor-suggestions-container {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
          border: 2px dashed #dee2e6;
        }

        .suggestions-title {
          margin-bottom: 10px;
          color: #495057;
          font-size: 16px;
          text-align: center;
        }

        .doctor-suggestions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .doctor-suggestion-item {
          padding: 8px 15px;
          background: white;
          border: 2px solid #007bff;
          border-radius: 20px;
          cursor: grab;
          transition: all 0.3s ease;
          user-select: none;
          font-size: 14px;
        }

        .doctor-suggestion-item:hover {
          background: #007bff;
          color: white;
          transform: translateY(-2px);
        }

        .doctor-suggestion-item:active {
          cursor: grabbing;
          transform: scale(0.95);
        }

        .search-input-container {
          position: relative;
        }

        .drop-zone {
          border: 2px dashed #28a745 !important;
          transition: all 0.3s ease;
        }

        .drop-zone:focus {
          border-color: #007bff !important;
        }

        .drag-hint {
          position: absolute;
          top: -25px;
          left: 0;
          background: #28a745;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }

        .clear_btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin: 0 10px;
        }

        .clear_btn:hover {
          background: #5a6268;
        }

        .advanced-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nodata_subtext {
          color: #7f8c8d;
          font-size: 14px;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
}

export default SessionDetails;