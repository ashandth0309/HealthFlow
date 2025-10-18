/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
function DischargeAdmit() {
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
      window.alert("Record Added successfully!");
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
          <h3 className="main_topic_admit">Discharge Petition</h3>
          <form onSubmit={handleSubmit}>

      
   
            <div>
              <label className="admit_card_label">Discharge status:</label>
              <br />
              <select
                name="discharge"
                className="form_input_columal"
                value={inputs.discharge || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="Yes">Yes</option>
                <option value="Yes">No</option>
              </select>
            </div>

            <button type="submit" className="search_btn_admit">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DischargeAdmit;
