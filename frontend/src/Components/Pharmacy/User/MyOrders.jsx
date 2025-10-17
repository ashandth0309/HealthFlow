import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HomeNav from "../Home/HomeNav";
import "./pharmacyUser.css";
import NotFound from "./img/nofound.png";
const URL = "http://localhost:8081/pharmacyorder";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function MyOrders() {
  const [pharmacy, setPharmacy] = useState([]);
  const [gmail, setGmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setGmail(e.target.value);
  };

  const handleViewOrders = () => {
    if (gmail === "") {
      setMessage("Please enter an email.");
      return;
    }

    fetchHandler()
      .then((data) => {
        const filteredData = data.pharmacy.filter(
          (pharmacy) => pharmacy.gmail === gmail
        );

        if (filteredData.length > 0) {
          setPharmacy(filteredData);
          setMessage(""); // Clear any previous messages
        } else {
          setPharmacy([]); // Clear table if no data found
          setMessage("No orders found for this email.");
        }
      })
      .catch((error) => {
        setMessage("Error fetching data. Please try again.");
        console.error(error);
      });
  };

  const deleteHandler = async (_id) => {
    try {
      // Fetch the order details
      const response = await axios.get(`${URL}/${_id}`);
      const order = response.data.pharmacy; // Access the nested pharmacy object

      // Log data to verify its content
      console.log("Fetched order:", order);

      // Normalize the status field
      const status = order.status ? order.status.trim().toLowerCase() : "";

      if (status === "approved") {
        window.alert("Cannot cancel an order that is already approved.");
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to cancel this order?"
      );

      if (confirmed) {
        try {
          await axios.delete(`${URL}/${_id}`);
          window.alert("Order canceled successfully!");
          handleViewOrders(); // Refresh the list of orders
        } catch (error) {
          console.error("Error canceling order:", error);
          window.alert("Error canceling order. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      window.alert("Error fetching order details. Please try again.");
    }
  };

  return (
    <div className="pharmacy_form_background_app">
      <HomeNav />
      <div>
        <div className="check_gmail_box_pharmacy">
          <div className="pharmacy_gmail_box">
            <label className="form_label_email" htmlFor="email">
              Enter Your Gmail
            </label>
            <br />
            <input
              type="email"
              id="email"
              className="gmail_insert"
              value={gmail}
              onChange={handleEmailChange}
            />
            <br />
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
            <div className="">
              <h2 className="topic_admin_pharmacy">My Orders</h2>
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
                      <tr className="admin_tbl_tr" key={order._id}>
                        <td className="pharmacy_table_td">{order.OrderID}</td>
                        <td className="pharmacy_table_td">
                          {order.prescriptionImg ? (
                            <img
                              src={`http://localhost:8081/uploadspharmacyorder/${order.prescriptionImg}`}
                              alt={order.prescriptionImg}
                              className="presImg"
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
                            className="pharmacy_update"
                            to={`/updateOrder/${order._id}`}
                          >
                            Update
                          </Link>
                          <button
                            className="pharmacy_deletbtn2"
                            onClick={() => deleteHandler(order._id)}
                          >
                            Cancel
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

export default MyOrders;
