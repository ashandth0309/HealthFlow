import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import HomeNav from "../Home/HomeNav";

function OrderStatus() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null); // State for current image
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/pharmacyorder/${id}`
        );
        setInputs(response.data.pharmacy);
        setCurrentImage(response.data.pharmacy.prescriptionImg); // Set current image URL
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFile(files[0]);
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in inputs) {
      formData.append(key, inputs[key]);
    }
    if (file) {
      formData.append("prescriptionImg", file);
    }

    try {
      await axios.put(`http://localhost:8081/pharmacyorder/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.alert("Status Added successfully!");
      navigate("/pharmacistDashbord");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  return (
    <div className="">
      <HomeNav />
      <br/>
      <div className="">
        <div className="pharmacy_from_full">
          <h1 className="form_head_pharmacy">Add Order Status </h1>
          <form className="pharmacy-form" onSubmit={handleSubmit}>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label">Full Name:</label>
                <br />
                <input
                  type="text"
                  name="fullname"
                  className="form-input"
                  value={inputs.fullname || ""}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Patient ID:</label>
                <br />
                <input
                  type="text"
                  name="patientID"
                  className="form-input"
                  value={inputs.patientID || ""}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label">Order ID:</label>
                <br />
                <input
                  type="text"
                  name="OrderID"
                  id="OrderID"
                  className="form-input"
                  value={inputs.OrderID}
                  readOnly
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone:</label>
                <br />
                <input
                  type="number"
                  name="phone"
                  pattern="[0-9]{10}"
                  className="form-input"
                  value={inputs.phone || ""}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label">Gmail:</label>
                <br />
                <input
                  type="email"
                  name="gmail"
                  className="form-input"
                  value={inputs.gmail || ""}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pharmacy Name:</label>
                <br />
                <input
                  type="text"
                  name="pharmacyname"
                  className="form-input"
                  value={inputs.pharmacyname || ""}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label">Delivery Method:</label>
                <br />

                <input
                  type="text"
                  name="deliveryMethod"
                  className="form-input"
                  value={inputs.deliveryMethod || ""}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address:</label>
                <br />
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={inputs.address || ""}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status:</label>
              <br />
              <select
                name="status"
                className="form_input_service"
                value={inputs.status || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select a Status</option>
                <option value="approved">Approved</option>
                <option value="reject">Reject</option>
              </select>
            </div>
            <div className="form-group">
                <label className="form-label">Message:</label>
                <br />
                <textarea
                  type="text"
                  name="message"
                  className="form_input_service"
                  value={inputs.message || ""}
                  onChange={handleChange}
                  required
                  
                />
              </div>
            <div className="form-group">
              <label className="form-label">Prescription:</label>
              <br />
              {currentImage && (
                <div>
                  <img
                    src={`http://localhost:8081/uploadspharmacyorder/${currentImage}`}
                    alt="Current Prescription"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                </div>
              )}
            </div>

            <button type="submit" className="submit_btn">
              Submit
            </button>
          </form>
        </div>
      </div>
      <br/>
    </div>
  );
}

export default OrderStatus;
