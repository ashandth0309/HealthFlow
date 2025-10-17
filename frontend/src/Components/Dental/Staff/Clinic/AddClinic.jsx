import { useState, useEffect } from "react";
import axios from "axios";
import StafNav from "../StafNav";

function AddClinic() {
  const [inputs, setInputs] = useState({
    clinicname: "",
    clinicID: "",
    location: "",
    details: "",
  });
  const generateClinicID = () => {
    const prefix = "CID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      clinicID: generateClinicID(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await sendRequest();
    window.alert("Clinic Added successfully!");
    window.location.href = "/clinic";
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/clinic", {
      clinicname: inputs.clinicname,
      clinicID: inputs.clinicID,
      location: inputs.location,
      details: inputs.details,
    });
  };

  return (
    <div className="dental_from_background">
      <StafNav />
      <div className="form_full_dental">
        <div className="appointment_from_full">
          <h1 className="form_head_dental">Add New Clinc </h1>
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
                onChange={(e) => {
                  const re = /^[A-Za-z\s]*$/;
                  if (re.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
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
              <label className="form-label" htmlFor="address">
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

export default AddClinic;
