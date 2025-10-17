import { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import HomeNav from "../Home/HomeNav";

function AddPayment() {
  const [inputs, setInputs] = useState({
    paymentID: "",
    paymentMethod: "",
    cardname: "",
    cardnumber: "",
    cardholdername: "",
    expdate: "",
    cvv: "",
    fullname: "",
    address: "",
    contactNo: "",
    email: "",
    amount: "",
  });

  const generatePaymentFunctionID = () => {
    const prefix = "PAYID";
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    
    // Get current date and time
    const currentDate = new Date();
    
    // Format date as YYYYMMDD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    // Format time as HHMMSS
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    // Combine everything to create a unique ID
    return `${prefix}${year}${month}${day}${hours}${minutes}${seconds}${randomNumber}`;
};

  useEffect(() => {
    // Fetch the appointmentPrice from localStorage
    const savedPrice = localStorage.getItem("appointmentPrice");

    // Ensure the amount is formatted to 2 decimal places
  const formattedAmount = savedPrice ? parseFloat(savedPrice).toFixed(2) : "";

  setInputs((prevInputs) => ({
    ...prevInputs,
    paymentID: generatePaymentFunctionID(),
    amount: formattedAmount, // Use the formatted amount
  }));
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "cardname" ||
      name === "cardholdername" ||
      name === "fullname"
    ) {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return;
      }
    }
    if (name === "contactNo") {
      if (!/^0\d{0,10}$/.test(value)) {
        return;
      }
    }
    if (name === "cvv") {
      if (!/^\d{0,3}$/.test(value)) {
        return;
      }
    }
    // Formatting card number to 'xxxx xxxx xxxx xxxx' format
    if (name === "cardnumber") {
      const formattedCardNumber = value
        .replace(/\D/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim(); // Format and limit to digits only
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: formattedCardNumber,
      }));
      return;
    }

    if (name === "address") {
      if (!/^[a-zA-Z\d\s,/.-]*$/.test(value)) {
        return;
      }
    }
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const luhnCheck = (num) => {
    let arr = (num + "")
      .split("")
      .reverse()
      .map((x) => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce(
      (acc, val, i) =>
        i % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val),
      0
    );
    sum += lastDigit;
    return sum % 10 === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!luhnCheck(inputs.cardnumber.replace(/\s/g, ""))) {
    //   window.alert("Invalid card number!");
    //   return;
    // }
    console.log(inputs);
    await sendRequest();
    savePaymentToLocalStorage();
    window.alert("Payment successful!");
    window.location.href = "./paymentSummry";
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:8081/paymentFunction", {
      paymentID: inputs.paymentID,
      paymentMethod: inputs.paymentMethod,
      cardname: inputs.cardname,
      cardnumber: inputs.cardnumber.replace(/\s/g, ""),
      cardholdername: inputs.cardholdername,
      expdate: inputs.expdate,
      cvv: inputs.cvv,
      fullname: inputs.fullname,
      address: inputs.address,
      contactNo: inputs.contactNo,
      email: inputs.email,
      amount: inputs.amount,
    });
  };

  const savePaymentToLocalStorage = () => {
    // Store the payment details in local storage
    localStorage.setItem("paymentDetails", JSON.stringify(inputs));
  };

  return (
    <div className="paymnt_background">
      <HomeNav />
      <div className="form_full_payment">
        <div className="payment_from_full">
          <h1 className="form_head_payment">pay now</h1>
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="input_groupfrom">
              <div className="form-group">
                <label className="form-label" htmlFor="clinicname">
                  payment ID:
                </label>
                <br />
                <input
                  type="text"
                  id="paymentID"
                  name="paymentID"
                  className="form-input"
                  value={inputs.paymentID}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  amount (Rs):
                </label>
                <br />
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="form-input"
                  value={inputs.amount}
                  onChange={handleChange}
                  required
                  readOnly // Make the field readonly
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">payment Method:</label>
              <br />
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="form_input_service"
                value={inputs.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select payment method
                </option>

                <option value="card">Card</option>
                
              </select>
            </div>
            {(inputs.paymentMethod === "card" ||
              inputs.paymentMethod === "cash") && (
              <div>
                <div className="">
                  <div className="form-group">
                    <label className="form-label">full name:</label>
                    <br />
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      className="form_input_service"
                      value={inputs.fullname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="input_groupfrom">
                  <div className="form-group">
                    <label className="form-label">contactNo:</label>
                    <br />
                    <input
                      type="number"
                      id="contactNo"
                      name="contactNo"
                      className="form-input"
                      value={inputs.contactNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">email:</label>
                    <br />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      value={inputs.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">address:</label>
                  <br />
                  <textarea
                    type="text"
                    id="address"
                    name="address"
                    className="form_input_service"
                    value={inputs.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Conditionally render card section if paymentMethod is 'card' */}
                {inputs.paymentMethod === "card" && (
                  <div className="card_section">
                    <div className="input_groupfrom">
                      <div className="form-group">
                        <label className="form-label" htmlFor="cardname">
                          card name:
                        </label>
                        <br />
                        <input
                          type="text"
                          id="cardname"
                          name="cardname"
                          className="form-input"
                          value={inputs.cardname}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">card holder name:</label>
                        <br />
                        <input
                          type="text"
                          id="cardholdername"
                          name="cardholdername"
                          className="form-input"
                          value={inputs.cardholdername}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">cardnumber:</label>
                      <br />
                      <input
                        type="text"
                        id="cardnumber"
                        name="cardnumber"
                        maxLength="19"
                        className="form_input_service"
                        value={inputs.cardnumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="input_groupfrom">
                      <div className="form-group">
                        <label className="form-label">EXP date:</label>
                        <br />
                        <input
                          type="month"
                          id="expdate"
                          name="expdate"
                          className="form-input"
                          placeholder="MM/YY"
                          value={inputs.expdate}
                          onChange={handleChange}
                          min={new Date().toISOString().slice(0, 7)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV:</label>
                        <br />
                        <input
                          type="number"
                          id="cvv"
                          name="cvv"
                          className="form-input"
                          value={inputs.cvv}
                          onChange={handleChange}
                          required
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <button type="submit" className="submit_btn">
                  Pay Now
                </button>
              </div>
            )}
            <div>
              {inputs.paymentMethod === "paypal" && (
                <div>
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: "100.00", // Total amount of the purchase
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then(function (details) {
                        alert(
                          "Transaction completed by " +
                            details.payer.name.given_name
                        );
                        // You can call your server to save the transaction details
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPayment;
