import { useState } from "react";
import axios from "axios";
import "jspdf-autotable";
import MaleDoc from "./img/male.png";
import FemaleDoc from "./img/female.png";
import DentalNav from "../../Home/DentalNav";
import NotFound from "./img/nofound.png";
import NotApp from "./img/noapp.jpg";
import "./Doctor.css";
const URL = "http://localhost:8081/appointment";
const URLOC = "http://localhost:8081/doctor";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

const fetchHandlerDoc = async () => {
  return await axios.get(URLOC).then((res) => res.data);
};

function MyAppointmentDoctor() {
  const [appointment, setAppointment] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [doctorID, setDoctorID] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [noAppointmentsMessage, setNoAppointmentsMessage] = useState("");

  const fetchData = async () => {
    const appointmentData = await fetchHandler();
    const doctorData = await fetchHandlerDoc();

    const filteredAppointments = appointmentData.dental.filter(
      (item) => item.doctorID === doctorID
    );
    const filteredDoctors = doctorData.doctorfunction.filter(
      (item) => item.doctorID === doctorID
    );

    setAppointment(filteredAppointments);
    setDoctor(filteredDoctors);

    // Set message if no appointments are found
    if (filteredAppointments.length === 0 && filteredDoctors.length > 0) {
      setNoAppointmentsMessage(
        "This doctor does not have any appointments yet."
      );
    } else {
      setNoAppointmentsMessage("");
    }
  };

  const handleCheck = () => {
    if (doctorID.trim() === "") {
      setIsValid(false);
      return;
    }

    // Validate doctorID exists
    fetchHandlerDoc().then((data) => {
      const doctorExists = data.doctorfunction.some(
        (item) => item.doctorID === doctorID
      );

      if (doctorExists) {
        setIsValid(true);
        fetchData();
      } else {
        setIsValid(false);
      }
    });
  };

  return (
    <div>
      <DentalNav />
      <div className="main_dental_staf">
        <div>
          <div className="dental_gmail_box">
            <label className="form_label_gmail" htmlFor="fullname">
              Enter Your ID
            </label>
            <br />
            <input
              type="text"
              value={doctorID}
              className="gmail_insert"
              onChange={(e) => setDoctorID(e.target.value)}
              placeholder="Enter Doctor ID"
            />
            <button className="submit_btn_gmail" onClick={handleCheck}>
              Check
            </button>
          </div>

          {!isValid && (
            <div className="not_found_box">
              <img src={NotFound} alt="noimg" className="notfound" />
              <p className="nodata_pera">No Details Found Check Your ID</p>
            </div>
          )}
          {isValid && (
            <div className="databody">
              <div>
                <div className="my_doc_details">
                  <div>
                    {doctor.map((item, index) => (
                      <div className="doc_details_card" key={index}>
                        <img
                          src={item.gender === "male" ? MaleDoc : FemaleDoc}
                          alt="Doctor"
                          className="doc_img"
                        />
                        <p className="doc_card_data">
                          <strong>ID:</strong> {item.doctorID}
                        </p>
                        <p className="doc_card_data">
                          <strong>Name:</strong> {item.doctorName}
                        </p>
                        <p className="doc_card_data">
                          <strong>Gender: </strong>
                          {item.gender}
                        </p>
                        <p className="doc_card_data">
                          <strong>Gmail:</strong> {item.gmail}
                        </p>
                        <p className="doc_card_data">
                          <strong>Clinic:</strong> {item.clinic}
                        </p>
                        <p className="doc_card_data">
                          <strong>Available time: </strong>
                          {item.timeSlotStart} - {item.timeSlotEnd}
                        </p>
                        <p className="doc_card_data">
                          <strong>Date:</strong> {item.date}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div>
                      {appointment.map((item, index) => (
                        <div className="doctor_card_app" key={index}>
                          <div className="app_doc_details">
                            <p className="doctor_card_app_details">
                              <strong>Patient Name : </strong>
                              {item.fullname}
                            </p>
                            <p className="doctor_card_app_details">
                              <strong>Appointment ID : </strong>
                              {item.appointmentID}
                            </p>
                          </div>

                          <p className="doctor_card_app_details">
                            <strong>Patient Phone : </strong>
                            {item.phone}
                          </p>
                          <p className="doctor_card_app_details">
                            <strong>Patient Email : </strong>
                            {item.email}
                          </p>
                          <p className="doctor_card_app_details">
                            <strong>Clinic :</strong> {item.clinic}
                          </p>
                          <div className="app_doc_details">
                            <p className="doctor_card_app_details">
                              <strong>Appointment Time : </strong>
                              {item.timeSlotStart} to
                              {item.timeSlotEnd}
                            </p>
                            <p className="doctor_card_app_details">
                              <strong>Appointment Date :</strong>
                              {item.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {noAppointmentsMessage && (
                      <div className="not_found_box aa_box_img">
                        <img src={NotApp} alt="noimg" className="notfound" />
                        <p className="nodata_pera">
                          Not Yet Appointment Available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAppointmentDoctor;
