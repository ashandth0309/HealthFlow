import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HomeNav from "../Home/HomeNav";
const URL = "http://localhost:8081/paymentFunction"; // Your backend API

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};
function MyCard() {
  const [email, setEmail] = useState(""); // Track user input
  const [paymentFunction, setPaymentFunction] = useState([]);
  const [message, setMessage] = useState(""); // For error/success messages

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle validation and display relevant payment details
  const handleViewPayments = () => {
    if (email === "") {
      setMessage("Please enter an email.");
      return;
    }

    fetchHandler()
      .then((data) => {
        // Filter payment data based on entered email
        const filteredData = data.paymentFunction.filter(
          (payment) => payment.email === email
        );

        if (filteredData.length > 0) {
          setPaymentFunction(filteredData); // Set filtered data
          setMessage(""); // Clear any previous messages
        } else {
          setPaymentFunction([]); // Clear table if no data found
          setMessage("No records found for this email.");
        }
      })
      .catch((error) => {
        setMessage("Error fetching data. Please try again.");
        console.error(error);
      });
  };
  const deleteHandler = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to Delete This Card?"
    );
    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`);
        window.alert("Card delete successfully!");
        window.location.reload(); // Reload to refresh displayed data
      } catch (error) {
        console.error("Error deleting payment details:", error);
      }
    }
  };
  return (
    <div>
      <HomeNav/>
      <div>
        <div className="check_gmail_box_payment">
          <div className="payment_gmail_box">
            <label className="form_label_email" htmlFor="email">
              Enter Your Email to View Card:
            </label>
            <br />
            <input
              type="email"
              id="email"
              className="gmail_insert"
              value={email}
              onChange={handleEmailChange}
            />
            <br />
            <button onClick={handleViewPayments} className="submit_btn_gmail">
              Validate
            </button>
            <br />
            {message && <p>{message}</p>}
          </div>
        </div>
        <div>
          <div className="main_payment_staf">
            {paymentFunction.length > 0 && (
              <div className="table_container">
                <h2 className="topic_admin_payment">My Card</h2>
                <table className="payment_table">
                  <thead>
                    <tr className="admin_tbl_tr">
                      <th className="payment_table_th">card ID</th>
                      <th className="payment_table_th">Card Name</th>
                      <th className="payment_table_th">Card Number</th>
                      <th className="payment_table_th">Card Holder Name</th>
                      <th className="payment_table_th">Expiration Date</th>
                      <th className="payment_table_th">CVV</th>
                      <th className="payment_table_th">Email</th>
                      <th className="payment_table_th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentFunction.filter(
                      (item) =>
                        item.cardID &&
                        item.cardname &&
                        item.cardnumber &&
                        item.cardholdername &&
                        item.expdate &&
                        item.cvv
                    ).map((item, index) => (
                      <tr className="" key={index}>
                        <td className="payment_table_td">{item.cardID}</td>
                        <td className="payment_table_td">{item.cardname}</td>
                        <td className="payment_table_td">{item.cardnumber}</td>
                        <td className="payment_table_td">
                          {item.cardholdername}
                        </td>
                        <td className="payment_table_td">{item.expdate}</td>
                        <td className="payment_table_td">{item.cvv}</td>
                        <td className="payment_table_td">{item.email}</td>
                        <td className="payment_table_td action_btn_table">
                          <Link
                            className="payment_update"
                            to={`/updateCard/${item._id}`}
                          >
                            Update
                          </Link>
                          <button
                            onClick={() => deleteHandler(item._id)}
                            className="payment_deletbtn2"
                          >
                            Remove
                          </button>
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

export default MyCard;
