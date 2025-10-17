/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import HomeNav from "../Home/HomeNav";
import "./admin.css";
function AddAdmit() {
  const navigate = useNavigate();
  const [section, setSection] = useState(1); // Controls the form sections
  const [inputs, setInputs] = useState({
    hospital: "",
    date: "",
    fullname: "",
    birth: "",
    gender: "",
    phone: "",
    address: "",
    guardian: "",
    relationship: "",
    contact: "",
    admitID: "",
    medications: "",
    past: "",
    symptoms: "",
    prescription: "",
    nic: "",
    price: "",
  });
  const [hospitals, setHospitals] = useState([]);
  const [admitCount, setAdmitCount] = useState(0);
  const maxAdmits = 1; // Maximum allowed admits per hospital per day

  const generateAdmitID = () => {
    const prefix = "AD";
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      const mockHospitals = [
        { _id: "1", hospitalname: "Lanka Hospital - Colombo", price: 3000 },
        { _id: "2", hospitalname: "Nawaloka Hospital - Colombo", price: 2000 },
        { _id: "3", hospitalname: "Hemas Hospital - Wattala", price: 1500 },
        {
          _id: "4",
          hospitalname: "Hemas Hospital - Thalawatugoda",
          price: 1000,
        },
        { _id: "5", hospitalname: "Central Hospital", price: 4000 },
      ];

      setHospitals(mockHospitals);
      setInputs((prevInputs) => ({
        ...prevInputs,
        admitID: generateAdmitID(),
        price: mockHospitals[0].price,
      }));
    };

    fetchHospitals();
  }, []);
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [name]: name === "prescription" ? files[0] : value,
      };

      // If the hospital is selected, set the price
      if (name === "hospital") {
        const selectedHospital = hospitals.find(
          (h) => h.hospitalname === value
        );
        updatedInputs.price = selectedHospital ? selectedHospital.price : ""; // Set the price
      }

      return updatedInputs;
    });
  };

  const checkAvailability = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/admit/admitCount?hospital=${inputs.hospital}&date=${inputs.date}`
      );
      const count = response.data.count;
      setAdmitCount(count);

      if (count >= maxAdmits) {
        alert("Hospital has reached the maximum admit capacity for the day.");
      } else {
        setSection(2); // Proceed to the next section if availability is confirmed
      }
    } catch (error) {
      console.error("Error checking availability", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Call your async function to send the request (e.g., sendRequest())
      await sendRequest();

      // Save the admitID separately
      localStorage.setItem("admitID", inputs.admitID);

      // Save the rest of the form data (excluding admitID)
      const { admitID, ...restOfFormData } = inputs;
      localStorage.setItem("formData", JSON.stringify(restOfFormData));

      // Notify the user of success
      alert("Admit added successfully!");
      window.location.href = "./admitSummry";
    } catch (error) {
      console.error("Error adding admit", error);
    }
  };

  const sendRequest = async () => {
    const formData = new FormData();
    for (const key in inputs) {
      formData.append(key, inputs[key]);
    }
    await axios.post("http://localhost:8081/admit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  return (
    <div>
      <HomeNav />
      <div className="admit_home_bk">
        <div className="form_full_admit">
          <div>
            {section === 1 && (
              <div className="from_one">
                <div className="admit_form_full">
                  <h1 className="form_head_admit">
                    Check Hospital Availability
                  </h1>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="input_group">
                      <div className="form_group_admit">
                        <div>
                          <label htmlFor="hospital">Select Hospital:</label>
                          <br />
                          <select
                            id="hospital"
                            name="hospital"
                            className="form_input_colum"
                            value={inputs.hospital}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Hospital</option>
                            {hospitals.map((hospital) => (
                              <option
                                key={hospital._id}
                                value={hospital.hospitalname}
                              >
                                {hospital.hospitalname}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <div className="form-group">
                            <label htmlFor="date">Select Date:</label>
                            <br />
                            <input
                              type="date"
                              id="date"
                              name="date"
                              className="form_input_colum"
                              value={inputs.date}
                              onChange={handleChange}
                              min={new Date().toISOString().split("T")[0]}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="submit_btn_checkbtn"
                      onClick={checkAvailability}
                    >
                      Check Availability
                    </button>
                  </form>
                </div>
              </div>
            )}

            {section === 2 && (
              <div className="from_one">
                <div className="admit_form_full">
                  <h1 className="form_head_admit">Enter Patient Details</h1>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="input_group">
                      <div className="form_group_admit">
                        <div className="form-group">
                          <label>Charges (Rs):</label>
                          <br />
                          <input
                            type="text"
                            id="price"
                            name="price"
                            className="form_input_colum"
                            value={inputs.price}
                            onChange={handleChange}
                            required
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Birthday</label>
                          <br />
                          <input
                            type="date"
                            id="birth"
                            name="birth"
                            className="form_input_colum"
                            value={inputs.birth}
                            onChange={handleChange}
                            required
                        
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="fullname">Full Name:</label>
                      <br />
                      <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        className="form_input_colum_full"
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
                    <div className="form_group_admit">
                      <div className="form_group_admit">
                        <div className="form-group">
                          <label htmlFor="gender">Gender:</label>
                          <br />
                          <select
                            id="gender"
                            name="gender"
                            className="form_input_colum"
                            value={inputs.gender}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone:</label>
                          <br />
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="form_input_colum"
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
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address:</label>
                      <br />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="form_input_colum_full"
                        value={inputs.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="input_group">
                      <div className="form_group_admit">
                        <div className="form-group">
                          <label htmlFor="guardian">Guardian Name:</label>
                          <br />
                          <input
                            type="text"
                            id="guardian"
                            name="guardian"
                            className="form_input_colum"
                            value={inputs.guardian}
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
                          <label htmlFor="relationship">Relationship:</label>
                          <br />
                          <input
                            type="text"
                            id="relationship"
                            name="relationship"
                            className="form_input_colum"
                            value={inputs.relationship}
                            onChange={(e) => {
                              const re = /^[A-Za-z\s]*$/;
                              if (re.test(e.target.value)) {
                                handleChange(e);
                              }
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form_group_admit">
                      <div className="form-group">
                        <label htmlFor="contact">Emergency Contact:</label>
                        <br />
                        <input
                          type="text"
                          id="contact"
                          name="contact"
                          className="form_input_colum"
                          value={inputs.contact}
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
                      <div className="form-group">
                        <label htmlFor="nic">NIC:</label>
                        <br />
                        <input
                          type="text"
                          id="nic"
                          name="nic"
                          className="form_input_colum"
                          value={inputs.nic}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="submit_btn_checkbtn"
                      onClick={() => setSection(3)}
                    >
                      Next
                    </button>
                  </form>
                </div>
              </div>
            )}

            {section === 3 && (
              <div className="from_one">
                <div className="admit_form_full with_set">
                  <h1 className="form_head_admit">Enter Medical Information</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="">
                      <div className="form-group">
                        <label htmlFor="medications">Medications:</label>
                        <br />
                        <textarea
                          id="medications"
                          name="medications"
                          className="form_input_colum_full"
                          value={inputs.medications}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="past">Past Medical History:</label>
                      <br />
                      <textarea
                        id="past"
                        name="past"
                        className="form_input_colum_full"
                        value={inputs.past}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="symptoms">Symptoms:</label>
                      <br />
                      <textarea
                        id="symptoms"
                        name="symptoms"
                        className="form_input_colum_full"
                        value={inputs.symptoms}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prescription">Prescription:</label>
                      <br />
                      <input
                        type="file"
                        id="prescription"
                        name="prescription"
                        className="form_input_colum_full"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button type="submit" className="submit_btn_checkbtn">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            )}

            {section === 4 && (
              <div className="admit_form_full">
                <h1 className="form_head_admit">Admit Added Successfully!</h1>
                <p>Your admit ID is: {inputs.admitID}</p>
                <button
                  className="submit_btn_checkbtn"
                  onClick={() => navigate("/admitdetails")}
                >
                  My Admit Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAdmit;
