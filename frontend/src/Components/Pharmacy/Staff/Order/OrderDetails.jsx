import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/nofound.png";
import StafNav from "../StafNav";
import "../staff.css";
const URL = "http://localhost:8081/pharmacyorder";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function OrderDetails() {
  //fetch data
  const [pharmacy, setPharmacy] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setPharmacy(data.pharmacy));
  }, []);

  /*Search Function */
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.pharmacy.filter((item) =>
        // Define which fields to search
        [
          item.fullname,
          item.phone,
          item.gmail,
          item.address,
          item.pharmacyname,
        ].some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setPharmacy(filtered);
      setNoResults(filtered.length === 0);
    });
  };

  /* Report Generation Function */
  const handleGenerateReport = () => {
    const doc = new jsPDF("landscape");

    doc.text("Order Report", 20, 10);

    const columns = [
      "Patient Name",
      "Patient ID",
      "Phone Number",
      "Gmail",
      "Pharmacy Name",
      "Delivery Method",
      "Address",
      "Order Status",
      "Shipping Status",
    ];

    const rows = pharmacy.map((item) => [
      item.fullname,
      item.patientID,
      item.phone,
      item.gmail,
      item.pharmacyname,
      item.deliveryMethod,
      item.address,
      item.status ? item.status : "Pending",
      item.shipping ? item.shipping : "Pending",
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save("Order_Report.pdf");
  };
  return (
    <div>
      <StafNav />
      <div className="main_pharmacy_staf">
        <div>
          <h1 className="topic_admin_pharmacy">Order Details</h1>
          <div>
            <div className="action_set_staf">
              <tr>
                <td className="">
                  <input
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="number"
                    name="search"
                    className="search_input"
                    placeholder="Search Here..."
                  ></input>
                </td>

                <td>
                  <button className="search_btn" onClick={handleSearch}>
                    Search
                  </button>
                </td>
              </tr>
              <div>
                <button className="denttl_btnn" onClick={handleGenerateReport}>
                  Generate Report
                </button>
              </div>
            </div>
            <br />
            <br />
            {noResults ? (
              <div className="not_found_box">
                <img src={NotFound} alt="noimg" className="notfound" />
                <p className="nodata_pera">No Details Found</p>
              </div>
            ) : (
              <div className="table_container">
                <table className="pharmacy_table">
                  <thead>
                    <tr className="admin_tbl_tr">
                      <th className="pharmacy_table_th">Order ID</th>
                      <th className="pharmacy_table_th">Prescription</th>
                      <th className="pharmacy_table_th">Patient ID</th>
                      <th className="pharmacy_table_th">Full Name</th>
                      <th className="pharmacy_table_th">Phone</th>
                      <th className="pharmacy_table_th">Email</th>
                      <th className="pharmacy_table_th">Address</th>
                      <th className="pharmacy_table_th">Pharmacy Name</th>
                      <th className="pharmacy_table_th">Delivery Method</th>
                      <th className="pharmacy_table_th">Order Status</th>
                      <th className="pharmacy_table_th">Shipping Status</th>
                      <th className="pharmacy_table_th">Message</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pharmacy.map((item, index) => (
                      <tr className="" key={index}>
                        <td className="pharmacy_table_td">{item.OrderID}</td>
                        <td className="pharmacy_table_td">
                          {item.prescriptionImg ? (
                            <img
                              src={`http://localhost:8081/uploadspharmacyorder/${item.prescriptionImg}`}
                              alt={item.prescriptionImg}
                              className="presImg"
                            />
                          ) : (
                            <span>No image available</span>
                          )}
                        </td>
                        <td className="pharmacy_table_td">{item.patientID}</td>
                        <td className="pharmacy_table_td">{item.fullname}</td>
                        <td className="pharmacy_table_td">{item.phone}</td>
                        <td className="pharmacy_table_td">{item.gmail}</td>
                        <td className="pharmacy_table_td">{item.address}</td>

                        <td className="pharmacy_table_td">
                          {item.pharmacyname}
                        </td>
                        <td className="pharmacy_table_td">
                          {item.deliveryMethod}
                        </td>

                        <td className="pharmacy_table_td">
                          {item.status ? item.status : "Pending"}
                        </td>
                        <td className="pharmacy_table_td">
                          {item.shipping ? item.shipping : "Pending"}
                        </td>
                        <td className="pharmacy_table_td">
                          {item.message ? item.message : "not yet"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
