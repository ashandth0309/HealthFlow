/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
function EditAdmitData() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch the existing data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/admit/${id}`);
        setInputs(response.data.admit);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
      formData.append("prescription", file);
    }

    try {
      await axios.put(`http://localhost:8081/admit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.alert("Updated successfully!");
      navigate("/adminAdmit");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  return (
    <div>
      <br />
      <br />
      <div className="data_card_admit">
        <div className="data_from_admit">
          <h3 className="main_topic_admit">Update Record</h3>
          <form onSubmit={handleSubmit}>
            <div className="from_data_sectn">
              <div>
                <label className="admit_card_label">Hospital:</label>
                <br />
                <input
                  type="text"
                  name="hospital"
                  placeholder="Hospital"
                  className="form_input_colum_update"
                  value={inputs.hospital || ""}
                  readOnly
                  required
                />
              </div>
              <div>
                <label className="admit_card_label">Date:</label>
                <br />
                <input
                  type="date"
                  name="date"
                  className="form_input_colum_update"
                  value={inputs.date || ""}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>
            </div>

            <div className="from_data_sectn">
              <div>
                <label className="admit_card_label">Charges:</label>
                <br />
                <input
                  type="text"
                  name="price"
                  className="form_input_colum_update"
                  value={inputs.price || ""}
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
                  className="form_input_colum_update"
                  value={inputs.birth}
                  onChange={handleChange}
                  required
                  
                />
              </div>
            </div>
            <div>
              <label className="admit_card_label">Full Name:</label>
              <br />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                className="form_input_columal"
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
            <div className="from_data_sectn">
              <div>
                <label className="admit_card_label">Gender:</label>
                <br />
                <select
                  name="gender"
                  className="form_input_colum_update"
                  value={inputs.gender || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="admit_card_label">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="form_input_colum_update"
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

            <div className="from_data_sectn">
              <div>
                <label className="admit_card_label">Address:</label>
                <br />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="form_input_colum_update"
                  value={inputs.address || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="admit_card_label">Guardian:</label>
                <br />
                <input
                  type="text"
                  name="guardian"
                  placeholder="Guardian"
                  className="form_input_colum_update"
                  value={inputs.guardian || ""}
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

            <div className="from_data_sectn">
              <div>
                <label className="admit_card_label">Relationship:</label>
                <br />
                <input
                  type="text"
                  name="relationship"
                  placeholder="Relationship"
                  className="form_input_colum_update"
                  value={inputs.relationship || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="admit_card_label">Contact:</label>
                <br />
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  className="form_input_colum_update"
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
            </div>

            <div className="from_data_sectn">
              <div>
                <label className="admit_card_label">NIC:</label>
                <br />
                <input
                  type="text"
                  name="nic"
                  placeholder="NIC"
                  className="form_input_colum_update"
                  value={inputs.nic || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="admit_card_label">Medications:</label>
                <br />
                <input
                  type="text"
                  name="medications"
                  placeholder="Medications"
                  className="form_input_colum_update"
                  value={inputs.medications || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="from_data_sectn">
              <div>
                <label className="admit_card_label">Medical History:</label>
                <br />
                <input
                  type="text"
                  name="past"
                  className="form_input_colum_update"
                  placeholder="Past Medical History"
                  value={inputs.past || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="admit_card_label">Symptoms:</label>
                <br />
                <input
                  type="text"
                  name="symptoms"
                  placeholder="Symptoms"
                  className="form_input_colum_update"
                  value={inputs.symptoms || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="admit_card_label">status:</label>
              <br />
              <select
                name="status"
                className="form_input_columal"
                value={inputs.status || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="Accept">Accept</option>
                <option value="Reject">Reject</option>
              </select>
            </div>

            <div className="from_data_sectn">
              <div>
                <label className="admit_card_label">Prescription:</label>
                <br />
                <input
                  type="file"
                  className="form_input_columal"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="search_btn_admit">
              Update Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditAdmitData;
