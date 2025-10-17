import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import HomeNav from "../Home/HomeNav";
function UpdateAppoimentUser() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/doctorAppointment/${id}`
        );
        setInputs(response.data.dappoiment);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/doctorAppointment/${id}`, {
        fullname: String(inputs.fullname),
        doctorAppoimentID: String(inputs.doctorAppoimentID),
        phone: String(inputs.phone),
        gmail: String(inputs.gmail),
        date: String(inputs.date),
        session: String(inputs.session),
        timeSlot: String(inputs.timeSlot),
        price: String(inputs.price),
        doctorname: String(inputs.doctorname), // Include doctorname
        location: String(inputs.location), // Include location
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  //to limit 10 digits
  const handleInput = (e) => {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.slice(0, 10);
    }
  };

  // Check if the pressed key is a numeric character
  const handleKeyDown = (e) => {
    if (
      (e.key >= "0" && e.key <= "9") ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      e.preventDefault(); // Prevent input if it's a number
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => {
      window.alert("Updated successfully!");
      history("/myAppoiment");
    });
  };
  return (
    <div>
      <HomeNav />
      <div className="form_full_doctor">
        <div className="doctor_from_full">
          <h1 className="form_head_doctor">Update Appointment</h1>
          <form className="doctor-form" onSubmit={handleSubmit}>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="clinicname">
                  Appointment ID:
                </label>
                <br />
                <input
                  type="text"
                  id="doctorAppoimentID"
                  name="doctorAppoimentID"
                  className="form-input"
                  value={inputs.doctorAppoimentID}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="session">
                  Session:
                </label>
                <br />
                <input
                  type="text"
                  id="session"
                  name="session"
                  className="form-input"
                  value={inputs.session}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="doctorname">
                  Doctor Name:
                </label>
                <br />
                <input
                  type="text"
                  id="doctorname"
                  name="doctorname"
                  className="form-input"
                  value={inputs.doctorname}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Location:
                </label>
                <br />
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-input"
                  value={inputs.location}
                  readOnly
                />
              </div>
            </div>

            <div className="input_group">
              <div className="form-group">
                <label className="form-label" htmlFor="date">
                  Date
                </label>
                <br />
                <input
                  type="text"
                  id="date"
                  name="date"
                  className="form-input"
                  value={inputs.date}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="timeSlot">
                  Time:
                </label>
                <br />
                <input
                  type="text"
                  id="timeSlot"
                  name="timeSlot"
                  className="form-input"
                  value={inputs.timeSlot}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Price:</label>
              <br />
              <input
                type="text"
                id="price"
                name="price"
                className="form_input_service"
                value={inputs.price}
   readOnly
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full name:</label>
              <br />
              <input
                type="text"
                id="fullname"
                name="fullname"
                className="form_input_service"
                value={inputs.fullname}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone:
              </label>
              <br />
              <input
                type="number"
                id="phone"
                name="phone"
                className="form_input_service"
                value={inputs.phone}
                onChange={handleChange}
                onInput={handleInput}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gmail">
                Email:
              </label>
              <br />
              <input
                type="email"
                id="gmail"
                name="gmail"
                className="form_input_service"
                value={inputs.gmail}
                onChange={handleChange}
                required
              />
            </div>
           
            <button type="submit" className="submit_btn">
              Update Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAppoimentUser;
