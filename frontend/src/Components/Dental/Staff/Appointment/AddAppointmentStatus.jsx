import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import StafNav from "../StafNav";
function AddAppointmentStatus() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/appointment/${id}`
        );
        setInputs(response.data.dental);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/appointment/${id}`, {
        fullname: String(inputs.fullname),
        appointmentID: String(inputs.appointmentID),
        phone: String(inputs.phone),
        email: String(inputs.email),
        service: String(inputs.service),
        clinic: String(inputs.clinic),
        doctor: String(inputs.doctor),
        date: String(inputs.date),
        time: String(inputs.time),
        appointmentStatus: String(inputs.appointmentStatus),
        price: String(inputs.price),
      })
      .then((res) => res.data);
  };
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);

    sendRequest().then(() => {
      window.alert("Status Addded successfully!");
      history("/stafhome");
    });
  };
  return (
    <div className="dental_from_background">
      <StafNav />
      <div className="form_full_dental">
        <div className="appointment_from_full">
          <h1 className="form_head_dental">Review Appointment </h1>{" "}
          <form className="appointment-form" onSubmit={handleSubmit}>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="fullname">
                  Full Name:
                </label>
                <br />
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="form-input"
                  value={inputs.fullname}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="appointmentID">
                  Appointment ID:
                </label>
                <br />
                <input
                  type="text"
                  id="appointmentID"
                  name="appointmentID"
                  className="form-input"
                  value={inputs.appointmentID}
                  readOnly
                  required
                />
              </div>
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone:
                </label>
                <br />
                <input
                  type="text"
                  id="phone"
                  pattern="[0-9]{10}"
                  name="phone"
                  className="form-input"
                  value={inputs.phone}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email:
                </label>
                <br />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={inputs.email}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="service">
                Service:
              </label>
              <br />
              <input
                id="service"
                name="service"
                className="form_input_service"
                value={inputs.service}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="clinic">
                  Clinic:
                </label>
                <br />
                <input
                  type="text"
                  id="clinic"
                  name="clinic"
                  className="form-input"
                  value={inputs.clinic}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="doctor">
                  Doctor:
                </label>
                <br />
                <input
                  type="text"
                  id="doctor"
                  name="doctor"
                  className="form-input"
                  value={inputs.doctor}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="date">
                  Date:
                </label>
                <br />
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={inputs.date}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="timeSlotStart">
                  Your Time Slot:
                </label>
                <div className="input_group">
                  <input
                    type="time"
                    id="timeSlotStart"
                    name="timeSlotStart"
                    className="forminput"
                    value={inputs.timeSlotStart}
                    onChange={handleChange}
                    readOnly
                  />
                  <span className="sub_date_titel">To</span>
                  <input
                    type="time"
                    id="timeSlotEnd"
                    name="timeSlotEnd"
                    className="forminput"
                    value={inputs.timeSlotEnd}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="appointmentID">
                Charges (Rs.):
              </label>
              <br />
              <input
                type="number"
                id="price"
                name="price"
                className="form_input_service"
                value={inputs.price}
                onChange={handleChange}
                readOnly
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="time">
                Appointment Status:
              </label>
              <br />
              <select
                id="appointmentStatus"
                name="appointmentStatus"
                className="form_input_service"
                value={inputs.appointmentStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
              </select>
            </div>

            <button type="submit" className="submit_btn">
              Add Status
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAppointmentStatus;
