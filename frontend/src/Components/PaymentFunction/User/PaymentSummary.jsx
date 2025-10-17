import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import HomeNav from "../Home/HomeNav";

function PaymentSummary() {
  const [paymentData, setPaymentData] = useState({});

  // Retrieve data from localStorage on component mount
  useEffect(() => {
    const savedPaymentData = JSON.parse(localStorage.getItem("paymentDetails"));
    if (savedPaymentData) {
      setPaymentData(savedPaymentData);
    }
  }, []);

  const downloadSummary = () => { 
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
    doc.setTextColor(0, 123, 255); // Black color for text
    doc.text("Bill To:", 12, 55);

    // Billing Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Full Name: ${paymentData.fullname}`, 10, 65);
    doc.text(`Address: ${paymentData.address}`, 10, 70);
    doc.text(`Contact No: ${paymentData.contactNo}`, 10, 75);
    doc.text(`Email: ${paymentData.email}`, 10, 80);

    // Payment Method Section
    doc.setDrawColor(0, 123, 255); // Blue color for borders
    doc.setFillColor(0, 123, 255, 0.1); // Light blue fill for section background
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

    // Fees and totals
    const { hospittelFee, channelingFee, tax, servicech, total } = calculateFees(paymentData.amount);

    // Total and VAT section
    doc.setFontSize(16);
    doc.setTextColor(0, 123, 255); // Blue for total section
    doc.text("Total and VAT Details", 12, 190);

    doc.setFontSize(12);
    doc.setTextColor(0); // Reset text color to black
    doc.text("Doctor Charges:", 10, 200);
    doc.text(`Rs. ${hospittelFee}.00`, 180, 200, { align: 'right' });
    doc.text("Hospital Charges:", 10, 205);
    doc.text(`Rs. ${channelingFee}.00`, 180, 205, { align: 'right' });
    doc.text("Service Charges:", 10, 210);
    doc.text(`Rs. ${servicech}.00`, 180, 210, { align: 'right' });
    doc.text("VAT:", 10, 215);
    doc.text(`Rs. ${tax}.00`, 180, 215, { align: 'right' });
    doc.text("Total Amount:", 10, 220);
    doc.text(`Rs. ${total}`, 180, 220, { align: 'right' });

    // Terms & Conditions
    doc.setFontSize(12);
    doc.setTextColor(100); // Grey color for conditions
    doc.text("Terms & Conditions", 10, 240);
    doc.setFontSize(10);
    doc.text("1. All services are non-refundable.", 10, 250);
    doc.text("2. All personal information is handled according to our Privacy Policy.", 10, 255);
    doc.text("3. Contact support at support@healthflow.com for billing inquiries.", 10, 260);

    // Save the PDF with a filename
    doc.save(`HealthFlow-Payment-${formattedDate}.pdf`);
};



  
  const calculateFees = (amount) => {
    const hospittelFee = amount-(amount * 0.30); // Doctor 70%
    const channelingFee = amount-(amount * 0.80); // Hospital 20%
    const tax = amount-(amount * 0.92); //vat 7.5%
    const servicech = amount-(amount * 0.98);// Service 2.5%
    const total = amount; // amount + all fees

    return {
      hospittelFee: hospittelFee,
      channelingFee: channelingFee,
      tax: tax,
      servicech: servicech,
      total: total,
    };
  };

  return (
    <div className="paymnt_background">
      <HomeNav />
      <div className="form_full_payment">
        <div className="payment_from_full">
          <h1 className="form_head_payment">Payment Summary</h1>
          {paymentData && (
            <div>
              {paymentData.paymentMethod === "cash" ? (
                <>
                  <p className="invoce_data">
                    <b>Payment Method: </b>
                    {paymentData.paymentMethod}
                  </p>
                  <p className="invoce_data">
                    <b>Payment ID: </b>
                    {paymentData.paymentID}
                  </p>
                  <p className="invoce_data">
                    <b>Full Name: </b>
                    {paymentData.fullname}
                  </p>
                  <p className="invoce_data">
                    <b>Address: </b>
                    {paymentData.address}
                  </p>
                  <p className="invoce_data">
                    <b>Contact No: </b>
                    {paymentData.contactNo}
                  </p>
                  <p className="invoce_data">
                    <b>Email: </b>
                    {paymentData.email}
                  </p>
                </>
              ) : (
                <>
                  <p className="invoce_data">
                    <b>Payment Method: </b>
                    {paymentData.paymentMethod}
                  </p>
                  <p className="invoce_data">
                    <b>Payment ID: </b>
                    {paymentData.paymentID}
                  </p>
                  <p className="invoce_data">
                    <b>Card Name: </b>
                    {paymentData.cardname}
                  </p>
                  <p className="invoce_data">
                    <b>Card Number: </b>
                    {paymentData.cardnumber}
                  </p>
                  <p className="invoce_data">
                    <b>Cardholder Name:</b> {paymentData.cardholdername}
                  </p>
                  <p className="invoce_data">
                    <b>Expiration Date: </b>
                    {paymentData.expdate}
                  </p>
                  <p className="invoce_data">
                    <b>CVV: </b>
                    {paymentData.cvv}
                  </p>

                  <p className="invoce_data">
                    <b>Full Name:</b> {paymentData.fullname}
                  </p>
                  <p className="invoce_data">
                    <b>Address:</b> {paymentData.address}
                  </p>
                  <p className="invoce_data">
                    <b>Contact No: </b>
                    {paymentData.contactNo}
                  </p>
                  <p className="invoce_data">
                    <b>Email:</b> {paymentData.email}
                  </p>
                  <p className="invoce_data">
                    <b>Price: </b>
                    Rs.{paymentData.amount}.00
                  </p>
                  <p className="invoce_data cennew">
                    <b>Payment Calculation</b>
                  </p>
                  <div className="paymnt_smury">
                    {paymentData.amount &&
                      (() => {
                        const { hospittelFee, channelingFee, tax, servicech } =
                          calculateFees(paymentData.amount);
                        return (
                          <>
                            <div>
  <p>Doctor Charges</p>
  <p>Hospital Charges</p>
  <p>Service Charges</p>
  <p>VAT*</p>
  <p>Total Amount</p>
</div>
<div>
  <p class="amount">Rs. {hospittelFee.toFixed(2)}</p>
  <p class="amount">Rs. {channelingFee.toFixed(2)}</p>
  <p class="amount">Rs. {servicech.toFixed(2)}</p>
  <p class="amount">Rs. {tax.toFixed(2)}</p>
  <p class="amount">Rs. {paymentData.amount}</p>
</div>
                          </>
                        );
                      })()}
                  </div>
                </>
              )}
            </div>
          )}
          <div className="invoice_action">
            <button className="dwon_btn" onClick={downloadSummary}>
              Download
            </button>
            <button
              className="dwon_btn"
              onClick={() => (window.location.href = "/myPayment")}
            >
              My Payment Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSummary;
