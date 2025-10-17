import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import StafNav from "../StafNav";
function UpdateClinic() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/clinic/${id}`);
        setInputs(response.data.clinic);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/clinic/${id}`, {
        clinicname: String(inputs.clinicname),
        clinicID: String(inputs.clinicID),
        location: String(inputs.location),
        details: String(inputs.details),
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
      window.alert("Clinic Updated successfully!");
      history("/clinic");
    });
  };
  return (
    <div className="dental_from_background">
      <StafNav />
      <div className="form_full_dental">
        <div className="appointment_from_full">
          <h1 className="form_head_dental">Update Clinic Details </h1>
          <form className="appointment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="clinicname">
                Clinic Name:
              </label>
              <br />
              <input
                type="text"
                id="clinicname"
                name="clinicname"
                className="form_input_service"
                value={inputs.clinicname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="appointmentID">
                Clinic ID:
              </label>
              <br />
              <input
                type="text"
                id="clinicID"
                name="clinicID"
                className="form_input_service"
                value={inputs.clinicID}
                readOnly
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Address:
              </label>
              <br />
              <textarea
                type="text"
                id="location"
                name="location"
                className="form_input_service"
                value={inputs.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Description:
              </label>
              <br />
              <textarea
                type="text"
                id="details"
                name="details"
                className="form_input_service"
                value={inputs.details}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit_btn">
              Add Clinic
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateClinic;
