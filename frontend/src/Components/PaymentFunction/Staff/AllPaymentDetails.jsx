import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import NotFound from "./img/nofound.png";
import "jspdf-autotable";

const URL = "http://localhost:8081/paymentFunction";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function AllPaymentDetails() {
  const [paymentFunction, setPaymentFunction] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => setPaymentFunction(data.paymentFunction));
  }, []);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filtered = data.paymentFunction.filter((paymentFunction) =>
        Object.values(paymentFunction).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setPaymentFunction(filtered);
      setNoResults(filtered.length === 0);
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF("l", "mm", "a4");

    // Company Name
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 123, 255);
    doc.text("Health", 10, 16);
    doc.setTextColor(0, 0, 0);
    doc.text("Flow", 27, 16);
    doc.text("-  Payment Details", 44, 16);

    // Define table with column widths
    const columnWidths = [30, 20, 35, 25, 25, 30, 20, 30, 30, 25, 15];
    doc.autoTable({
      head: [
        [
          "Payment ID",
          "Payment Method",
          "Full Name",
          "Contact No",
          "Amount",
          "Email",
          "Card Name",
          "Card Number",
          "Card Holder Name",
          "Expiration Date",
          "CVV",
        ],
      ],
      body: paymentFunction.map((item) => [
        item.paymentID,
        item.paymentMethod,
        item.fullname,
        item.contactNo,
        item.amount,
        item.email,
        item.cardname || "💸",
        item.cardnumber ? `**** **** **** ${item.cardnumber.slice(-4)}` : "💸",
        item.cardholdername || "💸",
        item.expdate || "💸",
        item.cvv ? "***" : "💸",
      ]),
      startY: 22,
      theme: "grid",
      headStyles: { fontSize: 10 },
      styles: { fontSize: 8 },
      columnStyles: columnWidths.reduce((acc, width, index) => {
        acc[index] = { cellWidth: width };
        return acc;
      }, {}),
      margin: { top: 10, bottom: 10, left: 10, right: 10 },
    });

    // Total earnings and generated date/time
    doc.setFontSize(12);
    doc.text(`Total Earnings: Rs.${totalEarnings.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    const date = new Date();
    doc.text(`Generated on: ${date.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 20);

    doc.save("Payment_details.pdf");
  };


  //Balanced Sheet
  const generateBalanceSheet = () => {
    const doc = new jsPDF("p", "mm", "a4");
  
    // Balance Sheet Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Balance Sheet", 105, 20, { align: "center" });
  
    // Example Assets
    const assets = [
      { item: "Cash", amount: 5000 },
      { item: "Accounts Receivable", amount: 2000 },
      { item: "Inventory", amount: 1000 },
    ];
  
    // Adding Total Earnings from your payment data as Liabilities
    const liabilities = [
      { item: "Accounts Payable", amount: 3000 },
      { item: "Bank Loan", amount: 1500 },
      { item: "Total Earnings", amount: totalEarnings },  // Using your calculated total earnings here
    ];
  
    const totalAssets = assets.reduce((acc, asset) => acc + asset.amount, 0);
    const totalLiabilities = liabilities.reduce((acc, liability) => acc + liability.amount, 0);
  
    // Add tables for Assets and Liabilities
    doc.autoTable({
      head: [["Assets", "Amount"]],
      body: assets.map((asset) => [asset.item, `Rs.${asset.amount.toFixed(2)}`]),
      startY: 30,
    });
  
    doc.autoTable({
      head: [["Liabilities", "Amount"]],
      body: liabilities.map((liability) => [liability.item, `Rs.${liability.amount.toFixed(2)}`]),
      startY: doc.lastAutoTable.finalY + 10,
    });
  
    // Add totals
    doc.setFontSize(12);
    doc.text(`Total Assets: Rs.${totalAssets.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Liabilities: Rs.${totalLiabilities.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);
  
    doc.save("Balance_sheet.pdf");
  };
  
  

  // Calculate total earnings
  const totalEarnings = paymentFunction.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);

  return (
    <div>
      <div className="main_payment_staf">
        <h1 className="topic_admin_payment">Payment Details</h1>
        <div>
          <div className="action_set_staf">
            <tr>
              <td className="">
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  name="search"
                  className="search_input"
                  placeholder="Search Here..."
                />
              </td>
              <td>
                <button onClick={handleSearch} className="search_btn">
                  Search
                </button>
              </td>
            </tr>
            <button onClick={generatePDF} className="denttl_btnn">
              Generate PDF
            </button>
            <button onClick={generateBalanceSheet} className="denttl_btnn">
              Generate Balance Sheet
            </button>
          </div>
          <br /> <br />
          {noResults ? (
            <div className="not_found_box">
              <img src={NotFound} alt="noimg" className="notfound" />
              <p className="nodata_pera">No Details Found</p>
            </div>
          ) : (
            <div className="table_container">
              <table className="payment_table">
                <thead>
                  <tr className="admin_tbl_tr">
                    <th className="payment_table_th">Payment ID</th>
                    <th className="payment_table_th">Payment Method</th>
                    <th className="payment_table_th">Full Name</th>
                    <th className="payment_table_th">Contact No</th>
                    <th className="payment_table_th">Amount</th>
                    <th className="payment_table_th">Email</th>
                    <th className="payment_table_th">Card Name</th>
                    <th className="payment_table_th">Card Number</th>
                    <th className="payment_table_th">Card Holder Name</th>
                    <th className="payment_table_th">Expiration Date</th>
                    <th className="payment_table_th">CVV</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentFunction
                    .filter((item) => item.paymentID)
                    .map((item, index) => (
                      <tr className="" key={index}>
                        <td className="payment_table_td">{item.paymentID}</td>
                        <td className="payment_table_td">{item.paymentMethod}</td>
                        <td className="payment_table_td">{item.fullname}</td>
                        <td className="payment_table_td">{item.contactNo}</td>
                        <td className="payment_table_td">{item.amount}</td>
                        <td className="payment_table_td">{item.email}</td>
                        <td className="payment_table_td">{item.cardname || "💸"}</td>
                        <td className="payment_table_td">{item.cardnumber ? `**** **** **** ${item.cardnumber.slice(-4)}` : "💸"}</td>
                        <td className="payment_table_td">{item.cardholdername || "💸"}</td>
                        <td className="payment_table_td">{item.expdate || "💸"}</td>
                        <td className="payment_table_td">{item.cvv ? "***" : "💸"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* Display total earnings */}
              <div className="total_earnings">
                <h3>Total Earnings: Rs.{totalEarnings.toFixed(2)}</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllPaymentDetails;
