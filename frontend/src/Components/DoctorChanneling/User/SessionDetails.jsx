import axios from "axios";
import { useState, useEffect } from "react";
import HomeNav from "../Home/HomeNav";
import { IoTime } from "react-icons/io5";
import { BsCalendarDateFill } from "react-icons/bs";
import NotFound from "./img/nofound.png";

const URL_SESSIONS = "http://localhost:8081/session";
const URL_APPOINTMENTS = "http://localhost:8081/doctorAppointment"; // Add the appointment URL

const fetchHandler = async () => {
  return await axios.get(URL_SESSIONS).then((res) => res.data);
};

const fetchAppointments = async () => {
  return await axios.get(URL_APPOINTMENTS).then((res) => res.data.dappoiment); // Get appointments
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

  useEffect(() => {
    fetchHandler().then(async (data) => {
      setSession(data.session);
      setFilteredSessions(data.session);
      const uniqueLocations = Array.from(
        new Set(data.session.map((item) => item.location))
      );
      setLocations(uniqueLocations);

      // Fetch appointments and adjust seat counts
      const appointments = await fetchAppointments();
      const updatedSessions = data.session.map((s) => {
        const relatedAppointments = appointments.filter(
          (a) =>
            a.session === s.sessionname &&
            a.date === s.date &&
            a.location === s.location &&
            a.doctorname === s.doctorname
        );
        return {
          ...s,
          seatcount: s.seatcount - relatedAppointments.length, // Reduce seat count based on appointments
        };
      });
      setFilteredSessions(updatedSessions);
    });
  }, []);

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

  return (
    <div>
      <HomeNav />
      <div className="main_doctor_staf home_bk_session">
        <h1 className="topic_admin_session">Book Your Session</h1>
        <div className="session_card_container">
          <div className="session_card">
            <div className="basic_search data_card_sessionn">
              <div className="data_card_session_new">
                <input
                  className="searcch_input"
                  placeholder="Enter Dr. Name"
                  type="text"
                  value={doctorName}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
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
                <div>
                  <input
                    type="checkbox"
                    checked={isAdvancedSearchEnabled}
                    onChange={handleToggle}
                  />{" "}
                  Advanced
                </div>
              </div>
            </div>
          </div>
        </div>
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
                        // Save the session details in localStorage
                        const sessionDetails = {
                          sessionname: item.sessionname,
                          date: item.date,
                          doctorname: item.doctorname,
                          location: item.location,
                          price: item.price,
                          timeslot: item.timeslots[0], // Save the first available time slot or selected one
                        };

                        localStorage.setItem(
                          "sessionDetails",
                          JSON.stringify(sessionDetails)
                        );

                        // Redirect to appointment selection page
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
              <p className="nodata_pera">No Details Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionDetails;
