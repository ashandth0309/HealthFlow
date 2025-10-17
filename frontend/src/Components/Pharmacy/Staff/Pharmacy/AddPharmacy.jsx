import { useState, useEffect } from "react";
import axios from "axios";
import StafNav from "../StafNav";
function AddPharmacy() {
  const [inputs, setInputs] = useState({
    pharmacyName: "",
    pharmacyID: "",
    location: "",
    details: "",
  });
  const generatePharmacyID = () => {
    const prefix = "PID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      pharmacyID: generatePharmacyID(),
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
    window.alert("Pharmacy Added successfully!");
    window.location.href = "./pharmacydash";
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/pharmacyshop", {
      pharmacyName: inputs.pharmacyName,
      pharmacyID: inputs.pharmacyID,
      location: inputs.location,
      details: inputs.details,
    });
  };

  return (
    <div className="pharmacy_from_background">
      <StafNav />
      <div className="form_full_pharmacy">
        <div className="pharmacy_from_full">
          <h1 className="form_head_pharmacy">Add New Pharmacy </h1>
          <form className="pharmacy-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="clinicname">
                Pharmacy Name:
              </label>
              <br />
              <input
                type="text"
                id="pharmacyName"
                name="pharmacyName"
                className="form_input_service"
                value={inputs.pharmacyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Pharmacy ID:
              </label>
              <br />
              <input
                type="text"
                id="pharmacyID"
                name="pharmacyID"
                className="form_input_service"
                value={inputs.pharmacyID}
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
              Add Pharmacy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPharmacy;
