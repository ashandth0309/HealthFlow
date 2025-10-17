import HomeNav from "../Home/HomeNav";
import { useState, useEffect } from "react";
import axios from "axios";
import "./pharmacyUser.css";
import "./adorder.css";
function AddOrder() {
  const [inputs, setInputs] = useState({
    fullname: "",
    patientID: "",
    phone: "",
    gmail: "",
    pharmacyname: "",
    pharmacyID: "",
    deliveryMethod: "",
    address: "",
    OrderID: "",
    prescriptionImg: null, // Adjusted for file input
  });
  // eslint-disable-next-line no-unused-vars
  const [pharmacyshop, setPharmacyshop] = useState([]);
  const [phrmacyOptions, setPharmacyOptions] = useState([]);
  const [noPharmacyMessage, setNoPharmacyMessage] = useState("");
  const [preview, setPreview] = useState(null); // State to hold image preview URL
  const generateOrderID = () => {
    const prefix = "OID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  const generatePeationID = () => {
    const prefix = "PID";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      OrderID: generateOrderID(),
      patientID: generatePeationID(),
    }));
  }, []);
  useEffect(() => {
    const fetchPharmacyShop = async () => {
      try {
        const response = await axios.get("http://localhost:8081/pharmacyshop");
        const pharmacyShop = response.data.pharmacyShop; // Use pharmacyShop with an uppercase 'S'

        if (pharmacyShop && pharmacyShop.length > 0) {
          setPharmacyshop(pharmacyShop); // Set the state with the fetched pharmacy shop data
          setPharmacyOptions(
            pharmacyShop.map((shop) => ({
              id: shop._id, // Ensure _id is correct
              name: shop.pharmacyName, // Pharmacy name for the dropdown
            }))
          );
          setNoPharmacyMessage("");
        } else {
          setNoPharmacyMessage("No pharmacy yet available.");
          setPharmacyOptions([]);
        }
      } catch (error) {
        console.error("Error fetching pharmacy data:", error);
        setNoPharmacyMessage("Error fetching pharmacy data.");
      }
    };

    fetchPharmacyShop();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pharmacyname") {
      // Find the selected pharmacy ID
      const selectedPharmacy = pharmacyshop.find(
        (pharmacy) => pharmacy.pharmacyName === value
      );
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
        pharmacyID: selectedPharmacy ? selectedPharmacy.pharmacyID : "", // Update pharmacyID
      }));
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: name === "prescriptionImg" ? files[0] : value,
      }));

      // Update image preview if a file is selected
      if (name === "prescriptionImg" && files[0]) {
        const file = files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          setPreview(reader.result); // Set preview URL
        };

        reader.readAsDataURL(file);
      }
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
    try {
      await sendRequest();
      alert("Order successfully!");

      // Save data to localStorage
      localStorage.setItem("formData", JSON.stringify(inputs));
      localStorage.setItem("prescriptionImage", preview); // Save the image URL

      window.location.href = "/orderSummmryPhar";
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const sendRequest = async () => {
    const formData = new FormData();
    for (const key in inputs) {
      formData.append(key, inputs[key]);
    }
    await axios.post("http://localhost:8081/pharmacyorder", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <div className="add_phamacybk">
      <HomeNav />
      <div>
        <div className="min_add_from_pharmacy">
          <div className="card_add_from_pharmacy">
            <div className="left_part_add_phramacy">
              <h4 className="lft_topic">Upload your prescription</h4>
              <p className="left_pharmacy_pera">
                Simply upload your prescription here and we’ll prepare your
                medication for you. Choose between picking it up or having it
                delivered to your doorstep.
              </p>
              <p className="left_pharmacy_pera">▫️ Enter patient details</p>
              <p className="left_pharmacy_pera">
                ▫️ Get an image of a prescription
              </p>
              <p className="left_pharmacy_pera">▫️ Upload</p>

              {preview && (
                <div className="image_preview">
                  <p className="selt_pera">Your Selected Prescription</p>
                  <img
                    src={preview}
                    alt="Image Preview"
                    className="previe_img"
                  />
                </div>
              )}
            </div>
            <form className="pharmacy_add_from" onSubmit={handleSubmit}>
              <h3 className="topic_from_pharmacy">Upload your prescription</h3>
              <div className="input_groupfrom">
                <div className="">
                  <label className="add_pharmacy_from_lable">Patient ID:</label>
                  <br />
                  <input
                    type="text"
                    name="patientID"
                    className="add_pharmacy_from_input"
                    value={inputs.patientID}
                    required
                    readOnly
                  />
                </div>
                <div className="">
                  <label className="add_pharmacy_from_lable">Order ID:</label>
                  <br />
                  <input
                    type="text"
                    name="OrderID"
                    id="OrderID"
                    className="add_pharmacy_from_input"
                    value={inputs.OrderID}
                    readOnly
                    required
                  />
                </div>
              </div>
              <div className="">
                <label className="add_pharmacy_from_lable">Full Name:</label>
                <br />
                <input
                  type="text"
                  name="fullname"
                  className="add_pharmacy_from_input drop_pharmacy"
                  value={inputs.fullname}
                  onChange={(e) => {
                    const re = /^[A-Za-z\s]*$/;
                    if (re.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                  required
                />
              </div>
              <div className="input_groupfrom">
                <div className="">
                  <label className="add_pharmacy_from_lable">Phone:</label>
                  <br />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="add_pharmacy_from_input"
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
                <div className="">
                  <label className="add_pharmacy_from_lable">Gmail:</label>
                  <br />
                  <input
                    type="email"
                    name="gmail"
                    className="add_pharmacy_from_input"
                    value={inputs.gmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="input_groupfrom">
                <div className="">
                  <label className="add_pharmacy_from_lable">
                    Pharmacy Name:
                  </label>
                  <br />
                  {noPharmacyMessage ? (
                    <p>{noPharmacyMessage}</p>
                  ) : (
                    <select
                      id="pharmacyname"
                      name="pharmacyname"
                      className="add_pharmacy_from_input "
                      value={inputs.pharmacyname}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Pharmacy</option>
                      {phrmacyOptions.map((pharmacyShop) => (
                        <option key={pharmacyShop.id} value={pharmacyShop.name}>
                          {pharmacyShop.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="disnonpart">
                  <label className="">Pharmacy ID:</label>
                  <br />
                  <input
                    type="text"
                    name="pharmacyID"
                    id="pharmacyID"
                    className=""
                    value={inputs.pharmacyID}
                    readOnly
                    required
                  />
                </div>

                <div className="">
                  <label className="add_pharmacy_from_lable">
                    Delivery Method:
                  </label>
                  <br />
                  <select
                    name="deliveryMethod"
                    className="add_pharmacy_from_input "
                    value={inputs.deliveryMethod || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a Method</option>
                    <option value="pickup">Pickup</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <div className="">
                <label className="add_pharmacy_from_lable">Address:</label>
                <br />
                <input
                  type="text"
                  name="address"
                  className="add_pharmacy_from_input drop_pharmacy"
                  value={inputs.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="">
                <label className="add_pharmacy_from_lable">Upload Image:</label>
                <br />
                <input
                  type="file"
                  name="prescriptionImg"
                  className="add_pharmacy_from_input drop_pharmacy"
                  onChange={handleChange}
                  required
                />
              </div>
              <p className="suport_para">
                ❕ Supporting image types will be png,gif, jpg. Maximum file
                size - 4MB. Only one attachment at a time.
              </p>
              <button type="submit" className="adfrom_subbtn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddOrder;
