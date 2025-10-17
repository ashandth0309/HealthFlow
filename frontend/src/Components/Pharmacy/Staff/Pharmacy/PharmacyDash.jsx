import StafNav from "../StafNav";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/nofound.png";

const URL = "http://localhost:8081/pharmacyshop";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function PharmacyDash() {
  //fetch data
  const [pharmacyShop, setPharmacyShop] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setPharmacyShop(data.pharmacyShop));
  }, []);

  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to delete this Pharmacy?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`); // Correct URL construction
        window.alert("Pharmacy Delete successfully!");
        window.location.reload();
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
      const filtered = data.pharmacyShop.filter((pharmacy) =>
        pharmacy.pharmacyID.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPharmacyShop(filtered);
      setNoResults(filtered.length === 0);
    });
  };
  
  /* Report Generation Function */
  const handleGenerateReport = () => {
    const doc = new jsPDF("landscape");

    doc.text("Pharmacy Report", 20, 10);

    const columns = ["Pharmacy Name", "Pharmacy ID", "Address", "Details"];

    const rows = pharmacyShop.map((item) => [
      item.pharmacyName,
      item.pharmacyID,
      item.location,
      item.details,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("pharmacy_shop_report.pdf");
  };
  return (
    <div>
      <StafNav />
      <div className="main_pharmacy_staf">
        <h1 className="topic_admin_pharmacy">Pharmacy Details</h1>
        <div className="action_set_staf">
          <button
            className="denttl_btnn"
            onClick={() => (window.location.href = "/addpharmacy")}
          >
            Add New Phamacy
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
        <br /> <br />
        {noResults ? (
          <div className="not_found_box">
            <img src={NotFound} alt="noimg" className="notfound" />
            <p className="nodata_pera">No Details Found</p>
          </div>
        ) : (
          <table className="pharmacy_table">
            <thead>
              <tr className="admin_tbl_tr">
                <th className="pharmacy_table_th">pharmacy Name</th>
                <th className="pharmacy_table_th">Pharmacy ID</th>
                <th className="pharmacy_table_th">Address</th>
                <th className="pharmacy_table_th">details</th>
                <th className="pharmacy_table_th">action</th>
              </tr>
            </thead>

            <tbody>
              {pharmacyShop.map((item, index) => (
                <tr className="" key={index}>
                  <td className="pharmacy_table_td">{item.pharmacyName}</td>
                  <td className="pharmacy_table_td">{item.pharmacyID}</td>
                  <td className="pharmacy_table_td">{item.location}</td>
                  <td className="pharmacy_table_td">{item.details}</td>
                  <td className="pharmacy_table_td data_btn">
                    <Link
                      className="pharmacy_update"
                      to={`/updatepharmacyshop/${item._id}`}
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => deleteHandler(item._id)}
                      className="pharmacy_deletbtn2"
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

export default PharmacyDash;
