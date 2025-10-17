import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import StafNav from "../StafNav";
function UpdatePharmacy() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/pharmacyshop/${id}`
        );
        setInputs(response.data.pharmacyShop);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8081/pharmacyshop/${id}`, {
        pharmacyName: String(inputs.pharmacyName),
        pharmacyID: String(inputs.pharmacyID),
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
      window.alert("Pharmacy Updated successfully!");
      history("/pharmacydash");
    });
  };
  return (
    <div className="pharmacy_from_background">
      <StafNav />
      <div className="form_full_pharmacy">
        <div className="pharmacy_from_full">
          <h1 className="form_head_pharmacy">Update Pharmacy </h1>
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
              Update Pharmacy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePharmacy;
