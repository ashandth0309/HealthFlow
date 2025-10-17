import { useState } from "react"; 
import axios from "axios";
import jsPDF from "jspdf";
import NotFound from "./img/nofound.png";
import HomeNav from "../Home/HomeNav";

const URL = "http://localhost:8081/paymentFunction"; // Your backend API

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function MyPayment() {
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
          setMessage("No payment records found for this email.");
        }
      })
      .catch((error) => {
        setMessage("Error fetching data. Please try again.");
        console.error(error);
      });
  };

  // Function to download the PDF summary
  const downloadSummary = (paymentData) => {
    const doc = new jsPDF();

    // Adding a border to the document
    doc.setLineWidth(1.5);
    doc.setDrawColor(0, 123, 255); // Blue border color
    doc.rect(5, 5, 200, 285); // Full-page border

    // Company Name: HealthFlow with styled colors
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 123, 255); // Blue color for "Health"
    doc.text("Health", 10, 20);
    doc.setTextColor(0, 0, 0); // Black color for "Flow"
    doc.text("Flow", 37, 20);

    // Payment Summary title
    doc.setFontSize(22);
    doc.setTextColor(0, 123, 255); // Blue theme for healthcare
    doc.text("Payment Receipt", 10, 40);

    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(); // e.g., "10/8/2025"
    const formattedTime = currentDate.toLocaleTimeString(); // e.g., "11:23:56 AM"

    // Add PDF generation date and time
    doc.setFontSize(12);
    doc.setTextColor(100); // Grey color for date and time
    doc.text(`Generated on: ${formattedDate} at ${formattedTime}`, 120, 40); // Positioned on the right

    // Bill To section
    doc.setFontSize(16);
    doc.setTextColor(0, 123, 255); // Blue color for text
    doc.text("Bill To:", 12, 55);

    // Billing Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Full Name: ${paymentData.fullname}`, 10, 65);
    doc.text(`Address: ${paymentData.address}`, 10, 70);
    doc.text(`Contact No: ${paymentData.contactNo}`, 10, 75);
    doc.text(`Email: ${paymentData.email}`, 10, 80);

    // Payment Method Section
    doc.setFontSize(16);
    doc.setTextColor(0, 123, 255); // Blue for section headings
    doc.text("Payment Method", 12, 95);

    // Payment Method Details
    doc.setFontSize(12);
    doc.setTextColor(0); // Reset text color to black
    doc.text(`Payment Method: ${paymentData.paymentMethod}`, 10, 105);
    doc.text(`Payment ID: ${paymentData.paymentID}`, 10, 110);

    // Payment Details Section
    doc.setFontSize(16);
    doc.setTextColor(0, 123, 255); // Blue for section headings
    doc.text("Payment Details", 12, 125);

    const maskedCardNumber = paymentData.cardnumber ? `**** **** **** ${paymentData.cardnumber.slice(-4)}` : "N/A"; 
    const maskedCVV = paymentData.cvv ? "***" : "N/A"; 

    doc.setFontSize(12);
    doc.setTextColor(0); // Black color for text
    if (paymentData.paymentMethod === "cash") {
        doc.text(`Full Name: ${paymentData.fullname}`, 10, 135);
        doc.text(`Address: ${paymentData.address}`, 10, 140);
        doc.text(`Contact No: ${paymentData.contactNo}`, 10, 145);
        doc.text(`Email: ${paymentData.email}`, 10, 150);
    } else {
        // Card details with masked sensitive data
        doc.text(`Card Name: ${paymentData.cardname}`, 10, 135);
        doc.text(`Card Number: ${maskedCardNumber}`, 10, 140); 
        doc.text(`Cardholder Name: ${paymentData.cardholdername}`, 10, 145);
        doc.text(`Expiration Date: ${paymentData.expdate}`, 10, 150);
        doc.text(`CVV: ${maskedCVV}`, 10, 155);
        doc.text(`Full Name: ${paymentData.fullname}`, 10, 160);
        doc.text(`Address: ${paymentData.address}`, 10, 165);
        doc.text(`Contact No: ${paymentData.contactNo}`, 10, 170);
        doc.text(`Email: ${paymentData.email}`, 10, 175);
    }

    // Save the PDF with a filename
    doc.save(`HealthFlow-Payment-${formattedDate}.pdf`);
  };

  return (
    <div>
      <HomeNav />
      <div className="check_gmail_box_payment">
        <div className="payment_gmail_box">
          <label className="form_label_email" htmlFor="email">
            Enter Your Email to View Payments:
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
          {message && (
            <div className="not_found_box">
              <img src={NotFound} alt="noimg" className="notfound" />
              <p className="nodata_pera">{message}</p>
            </div>
          )}
        </div>
      </div>
      <div className="main_payment_staf">
        {/* Display table only if payment data is available */}
        {paymentFunction.length > 0 && (
          <div>
            <h2 className="topic_admin_payment">My Payments</h2>
            <div className="table_container">
              <table className="payment_table">
                <thead>
                  <tr className="admin_tbl_tr">
                    <th className="payment_table_th">Payment ID</th>
                    <th className="payment_table_th">Payment Method</th>
                    <th className="payment_table_th">Full Name</th>
                    <th className="payment_table_th">Address</th>
                    <th className="payment_table_th">Contact No</th>
                    <th className="payment_table_th">Amount</th>
                    <th className="payment_table_th">Email</th>
                    <th className="payment_table_th">Card Name</th>
                    <th className="payment_table_th">Card Number</th>
                    <th className="payment_table_th">Card Holder Name</th>
                    <th className="payment_table_th">Expiration Date</th>
                    <th className="payment_table_th">CVV</th>
                    <th className="payment_table_th">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentFunction
                    .filter(
                      (item) =>
                        item.paymentID &&
                        item.paymentMethod &&
                        item.fullname &&
                        item.address &&
                        item.contactNo &&
                        item.amount
                    )
                    .map((item, index) => (
                      <tr key={index}>
                        <td className="payment_table_td">{item.paymentID}</td>
                        <td className="payment_table_td">
                          {item.paymentMethod}
                        </td>
                        <td className="payment_table_td">{item.fullname}</td>
                        <td className="payment_table_td">{item.address}</td>
                        <td className="payment_table_td">{item.contactNo}</td>
                        <td className="payment_table_td">{item.amount}</td>
                        <td className="payment_table_td">{item.email}</td>
                        <td className="payment_table_td">{item.cardname}</td>
                        <td className="payment_table_td">{item.cardnumber}</td>
                        <td className="payment_table_td">
                          {item.cardholdername}
                        </td>
                        <td className="payment_table_td">{item.expdate}</td>
                        <td className="payment_table_td">{item.cvv}</td>
                        <td>
                          <button
                            onClick={() => downloadSummary(item)}
                            className="tbl_btn"
                          >
                            Print
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
  );
}

export default MyPayment;
