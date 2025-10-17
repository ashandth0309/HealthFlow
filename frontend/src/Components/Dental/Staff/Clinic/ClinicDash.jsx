import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/nofound.png";
import { useNavigate } from "react-router-dom";
import StafNav from "../StafNav";
const URL = "http://localhost:8081/clinic";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function ClinicDash() {
  //fetch data
  const [clinic, setClinic] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setClinic(data.clinic));
  }, []);

  /*Delete Function */
  const history = useNavigate();
  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to delete this Clinic?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`); // Correct URL construction
        window.alert("Clinic deleted successfully!");
        history("/clinic");
        window.location.reload(); // Reload the page
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error deleting details:", error);
      }
    }
  };
  /*Search Function */
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.clinic.filter((clinic) =>
        Object.values(clinic).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setClinic(filtered);
      setNoResults(filtered.length === 0);
    });
  };
  /* Report Generation Function */
  const handleGenerateReport = () => {
    const doc = new jsPDF();

    doc.text("Clinic Report", 20, 10);

    const columns = ["Clinic Name", "Clinic ID", "Address", "Details"];

    const rows = clinic.map((item) => [
      item.clinicname,
      item.clinicID,
      item.location,
      item.details,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("clinic_report.pdf");
  };
  return (
    <div>
      <StafNav />
      <div className="main_dental_staf">
        <h1 className="topic_admin_dental">Clinic Details</h1>
        <div className="action_set_staf">
          <button
            className="denttl_btnn"
            onClick={() => (window.location.href = "/addCliinic")}
          >
            Add New Clinic
          </button>
          <tr>
            <td className="">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                name="search"
                className="search_input"
                placeholder="Search Here..."
              ></input>
            </td>

            <td>
              <button onClick={handleSearch} className="search_btn">
                Search
              </button>
            </td>
          </tr>
          <button className="denttl_btnn" onClick={handleGenerateReport}>
            Generate Report
          </button>
        </div>
        <br/> <br/>
        {noResults ? (
          <div className="not_found_box">
            <img src={NotFound} alt="noimg" className="notfound" />
            <p className="nodata_pera">No Details Found</p>
          </div>
        ) : (
          <table className="dental_table">
            <thead>
              <tr className="admin_tbl_tr">
                <th className="dental_table_th">clinicname</th>
                <th className="dental_table_th">clinicID</th>
                <th className="dental_table_th">Address</th>
                <th className="dental_table_th">details</th>
                <th className="dental_table_th">action</th>
              </tr>
            </thead>

            <tbody>
              {clinic.map((item, index) => (
                <tr className="" key={index}>
                  <td className="dental_table_td">{item.clinicname}</td>
                  <td className="dental_table_td">{item.clinicID}</td>
                  <td className="dental_table_td">{item.location}</td>
                  <td className="dental_table_td">{item.details}</td>
                  <td className="dental_table_td data_btn">
                    <Link
                      className="dental_update"
                      to={`/updateclinic/${item._id}`}
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => deleteHandler(item._id)}
                      className="dental_deletbtn2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ClinicDash;
