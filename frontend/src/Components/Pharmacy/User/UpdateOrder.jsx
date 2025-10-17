import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import HomeNav from "../Home/HomeNav";
import "./pharmacyUser.css";
function UpdateOrder() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null); // State for current image
  const navigate = useNavigate();
  const { id } = useParams();
  const [pharmacyshop, setPharmacyshop] = useState([]);
  const [pharmacyOptions, setPharmacyOptions] = useState([]);
  const [noPharmacyMessage, setNoPharmacyMessage] = useState("");

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        // Fetch the order details
        const response = await axios.get(
          `http://localhost:8081/pharmacyorder/${id}`
        );
        setInputs(response.data.pharmacy);
        setCurrentImage(response.data.pharmacy.prescriptionImg);

        // Fetch pharmacies
        const pharmacyResponse = await axios.get(
          "http://localhost:8081/pharmacyshop"
        );
        const pharmacyShop = pharmacyResponse.data.pharmacyShop;

        if (pharmacyShop && pharmacyShop.length > 0) {
          setPharmacyshop(pharmacyShop);
          setPharmacyOptions(
            pharmacyShop.map((shop) => ({
              id: shop._id,
              name: shop.pharmacyName,
            }))
          );
          setNoPharmacyMessage("");
        } else {
          setNoPharmacyMessage("No pharmacy yet available.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setNoPharmacyMessage("Error fetching pharmacy data.");
      }
    };
    fetchHandler();
  }, [id]);

  // const handleChange = (e) => {
  //   const { name, value, type, files } = e.target;
  //   if (type === "file") {
  //     setFile(files[0]);
  //   } else {
  //     setInputs((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   }
  // };
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "pharmacyname") {
      const selectedPharmacy = pharmacyshop.find(
        (pharmacy) => pharmacy.pharmacyName === value
      );
      setInputs((prevState) => ({
        ...prevState,
        pharmacyname: value,
        pharmacyID: selectedPharmacy ? selectedPharmacy._id : "", // Update pharmacyID
      }));
    } else if (type === "file") {
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
    if (inputs.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return; // Prevent form submission
    }
    const lettersOnly = /^[A-Za-z\s]*$/; // Regular expression to allow only letters and spaces
    if (!lettersOnly.test(inputs.fullname)) {
      alert("Full name can only contain letters and spaces.");
      return; // Prevent form submission if invalid
    }
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
      window.alert("Updated successfully!");
      navigate("/myorders");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="pharmacy_from_background">
      <HomeNav />
      <div className="form_full_pharmacy">
        <div className="pharmacy_from_full">
          <h1 className="form_head_pharmacy">Update Order</h1>
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
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone:</label>
                <br />
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={inputs.phone}
                  onChange={(e) => {
                    const re = /^[0-9\b]{0,10}$/;
                    if (re.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits."
                  required
                />
              </div>
            </div>{" "}
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
              <div>
                <label className="form-label">Pharmacy Name:</label>
                <br />
                {noPharmacyMessage ? (
                  <p>{noPharmacyMessage}</p>
                ) : (
                  <select
                    name="pharmacyname"
                    className="form-input"
                    value={inputs.pharmacyname || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Pharmacy</option>
                    {pharmacyOptions.map((pharmacy) => (
                      <option key={pharmacy.id} value={pharmacy.name}>
                        {pharmacy.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>{" "}
            <div className="input_group">
              <div className="form-group">
                <label className="form-label">Delivery Method:</label>
                <br />
                <select
                  name="deliveryMethod"
                  className="form-input"
                  value={inputs.deliveryMethod || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Method</option>
                  <option value="pickup">Pickup</option>
                  <option value="delivered">Delivered</option>
                </select>
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
                />
              </div>
            </div>
            <div className="input_group">
              <div className="form-group">
                <label className="form-label">Current Image:</label>
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
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Upload New Image:</label>
                <br />
                <input
                  type="file"
                  name="prescriptionImg"
                  className="form-input"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="submit_btn">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateOrder;
