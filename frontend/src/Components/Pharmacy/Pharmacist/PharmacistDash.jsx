import HomeNav from "../Home/HomeNav";
import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotFound from "./img/nofound.png";
import { Link, useNavigate } from "react-router-dom";
const URL = "http://localhost:8081/pharmacyorder";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function PharmacistDash() {
  const [pharmacy, setPharmacy] = useState([]);
  const [pharmacyID, setPharmacyID] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);

  const openModal = (imgSrc) => {
    setCurrentImage(imgSrc);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsZoomed(false); // Reset zoom on close
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed); // Toggle zoom state
  };

  const handleEmailChange = (e) => {
    setPharmacyID(e.target.value);
  };
  const handleViewOrders = () => {
    if (pharmacyID === "") {
      setMessage("Please enter an shopID.");
      return;
    }

    fetchHandler()
      .then((data) => {
        const filteredData = data.pharmacy.filter(
          (pharmacy) => pharmacy.pharmacyID === pharmacyID
        );

        if (filteredData.length > 0) {
          setPharmacy(filteredData);
          setMessage(""); // Clear any previous messages
        } else {
          setPharmacy([]); // Clear table if no data found
          setMessage("No orders found for this ID.");
        }
      })
      .catch((error) => {
        setMessage("Error fetching data. Please try again.");
        console.error(error);
      });
  };
  const navigate = useNavigate();
  const handleShippingClick = (status, orderId) => {
    if (status !== "approved") {
      alert("Please approve the order first.");
      return;
    }
    // Programmatically navigate to the shipping status page if approved
    navigate(`/shippingStatusPharmacy/${orderId}`);
  };

  /*Delete Function */
  // eslint-disable-next-line no-unused-vars
  const history = useNavigate();

  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to delete this Order?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`); // Correct URL construction
        window.alert("Order deleted successfully!");
        handleViewOrders();
        window.location.reload(); // Reload the page
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error deleting details:", error);
      }
    }
  };
  const generateReport = () => {
    const doc = new jsPDF("landscape");

    // Define the columns and their respective data keys
    const columns = [
      { header: "Order ID", dataKey: "OrderID" },
      { header: "Prescription", dataKey: "prescriptionImg" },
      { header: "Patient ID", dataKey: "patientID" },
      { header: "Full Name", dataKey: "fullname" },
      { header: "Phone", dataKey: "phone" },
      { header: "Email", dataKey: "gmail" },
      { header: "Address", dataKey: "address" },
      { header: "Pharmacy Name", dataKey: "pharmacyname" },
      { header: "Delivery Method", dataKey: "deliveryMethod" },
      { header: "Order Status", dataKey: "status" },
      { header: "Shipping Status", dataKey: "shipping" },
      { header: "Message", dataKey: "message" },
    ];

    // Map the pharmacy data to the format required by autoTable
    const rows = pharmacy.map((order) => ({
      OrderID: order.OrderID,
      prescriptionImg: order.prescriptionImg ? "Image Available" : "No Image",
      patientID: order.patientID,
      fullname: order.fullname,
      phone: order.phone,
      gmail: order.gmail,
      address: order.address,
      pharmacyname: order.pharmacyname,
      deliveryMethod: order.deliveryMethod,
      status: order.status || "Pending",
      shipping: order.shipping || "Pending",
      message: order.message || "Not yet",
    }));

    // Add title
    doc.text("Pharmacy Orders Report", 14, 10);

    // Create the autoTable
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 20,
    });

    // Save the PDF
    doc.save("pharmacy_orders_report.pdf");
  };
  return (
    <div className="pharmacy_form_background_app">
      <HomeNav />
      <div>
        <div className="check_gmail_box_pharmacy">
          <div className="pharmacy_gmail_box">
            <label className="form_label_email">Enter Your ID</label>
            <br />
            <input
              type="text"
              id="email"
              className="gmail_insert"
              value={pharmacyID}
              placeholder="PID375400906"
              maxLength="12"
              required
              // onChange={handleEmailChange}
              onChange={(e) => {
                const re = /^[A-Za-z0-9\s]*$/; // Allow letters, numbers, and spaces
                if (re.test(e.target.value)) {
                  handleEmailChange(e);
                }
              }}
            />
            <button onClick={handleViewOrders} className="submit_btn_gmail">
              View My Orders
            </button>
          </div>
        </div>
        {message && (
          <div className="not_found_box">
            <img src={NotFound} alt="noimg" className="notfound" />
            <p className="nodata_pera">{message}</p>
          </div>
        )}
        <div className="main_pharmacy_staf">
          {pharmacy.length > 0 && (
            <div>
              <button onClick={generateReport} className="denttl_btnn">
                Generate Report
              </button>
              <h2 className="topic_admin_pharmacy">My Orders</h2>
              {/* Modal for image zooming */}
              {isOpen && (
                <div className="modal" onClick={closeModal}>
                  <span className="close" onClick={closeModal}>
                    &times;
                  </span>
                  <img
                    src={currentImage}
                    className={`modal-content ${isZoomed ? "zoom" : ""}`}
                    onClick={toggleZoom} // Toggle zoom on click
                    alt="Prescription"
                  />
                </div>
              )}

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
                      <th className="pharmacy_table_th">Status Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pharmacy.map((order) => (
                      <tr key={order._id}>
                        <td className="pharmacy_table_td">{order.OrderID}</td>
                        <td className="pharmacy_table_td">
                          {order.prescriptionImg ? (
                            <img
                              src={`http://localhost:8081/uploadspharmacyorder/${order.prescriptionImg}`}
                              alt={order.prescriptionImg}
                              className="presImg"
                              onClick={() =>
                                openModal(
                                  `http://localhost:8081/uploadspharmacyorder/${order.prescriptionImg}`
                                )
                              }
                            />
                          ) : (
                            <span>No image available</span>
                          )}
                        </td>

                        <td className="pharmacy_table_td">{order.patientID}</td>
                        <td className="pharmacy_table_td">{order.fullname}</td>
                        <td className="pharmacy_table_td">{order.phone}</td>
                        <td className="pharmacy_table_td">{order.gmail}</td>
                        <td className="pharmacy_table_td">{order.address}</td>

                        <td className="pharmacy_table_td">
                          {order.pharmacyname}
                        </td>
                        <td className="pharmacy_table_td">
                          {order.deliveryMethod}
                        </td>

                        <td className="pharmacy_table_td">
                          {order.status ? order.status : "Pending"}
                        </td>
                        <td className="pharmacy_table_td">
                          {order.shipping ? order.shipping : "Pending"}
                        </td>
                        <td className="pharmacy_table_td">
                          {order.message ? order.message : "not yet"}
                        </td>
                        <td className="pharmacy_table_td actibtn">
                          <Link
                            className="pharmacy_update "
                            to={`/orderStatusPharmacy/${order._id}`}
                          >
                            Order
                          </Link>
                          <button
                            className="pharmacy_update "
                            onClick={() =>
                              handleShippingClick(order.status, order._id)
                            }
                          >
                            Shipping
                          </button>
                          <button
                            className="pharmacy_deletbtn2 "
                            onClick={() => deleteHandler(order._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PharmacistDash;
