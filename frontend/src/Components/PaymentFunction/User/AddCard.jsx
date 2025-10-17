import { useState, useEffect } from "react";
import axios from "axios";
import "./paymentFunction.css";
import HomeNav from "../Home/HomeNav";

function AddCard() {
  const [inputs, setInputs] = useState({
    cardID: "",
    cardname: "",
    cardnumber: "",
    cardholdername: "",
    expdate: "",
    cvv: "",
    fullname: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  // Function to generate a unique card ID
  const generateCreditCardID = () => {
    const prefix = "CCID"; // Prefix for card ID
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000); // Generate a random number
    return `${prefix}${randomNumber}`;
  };

  // Set cardID when component loads
  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      cardID: generateCreditCardID(),
    }));
  }, []);

  // Handle input changes with special handling for card number formatting
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Formatting card number to 'xxxx xxxx xxxx xxxx' format
    if (name === "cardnumber") {
      const formattedCardNumber = value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim(); // Format and limit to digits only
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: formattedCardNumber,
      }));
    } 
    // Validation for Card Name and Cardholder Name to allow only letters and spaces
    else if (name === "cardname" || name === "cardholdername") {
      const validValue = value.replace(/[^a-zA-Z\s]/g, ""); // Remove any numbers or special characters
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: validValue,
      }));
    } 
    // For other fields
    else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
    }
  };

  // Luhn algorithm to validate card number
  const luhnCheck = (num) => {
    let arr = (num + "")
      .replace(/\s+/g, "")
      .split("")
      .reverse()
      .map((x) => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce(
      (acc, val, idx) =>
        acc + (idx % 2 !== 0 ? val : ((val * 2) % 9) || 9),
      0
    );
    return (sum + lastDigit) % 10 === 0;
  };

  // Function to validate form inputs
  const validateInputs = () => {
    let tempErrors = {};

    const cardnumberNoSpaces = inputs.cardnumber.replace(/\s+/g, ""); // Remove spaces to validate card number

    // Validate card number (Luhn algorithm + check if 16 digits)
    if (cardnumberNoSpaces.length !== 16 || !luhnCheck(cardnumberNoSpaces)) {
      tempErrors.cardnumber = "Invalid card number!";
    }

    // Validate expiration date (no past dates allowed)
    if (!inputs.expdate) {
      tempErrors.expdate = "Expiration date is required!";
    }

    // Validate cardholder name (must be letters and spaces only)
    if (!/^[A-Za-z\s]+$/.test(inputs.cardholdername)) {
      tempErrors.cardholdername = "Cardholder name can only contain letters and spaces!";
    }

    // Validate card name (must be letters and spaces only)
    if (!/^[A-Za-z\s]+$/.test(inputs.cardname)) {
      tempErrors.cardname = "Card name can only contain letters and spaces!";
    }

    // Validate CVV (must be 3 or 4 digits)
    if (!/^\d{3,4}$/.test(inputs.cvv)) {
      tempErrors.cvv = "Invalid CVV!";
    }

    // Validate email format
    if (!inputs.email || !/^\S+@\S+\.\S+$/.test(inputs.email)) {
      tempErrors.email = "Invalid email format!";
    }

    setErrors(tempErrors);

    // Return true if no errors
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before sending request
    if (!validateInputs()) return;

    // Send request if validation is successful
    await sendRequest();
    savePaymentToLocalStorage();
    window.alert("Card Added successfully!");
    window.location.href = "./myCard";
  };

  // Function to send card details to the server
  const sendRequest = async () => {
    await axios.post("http://localhost:8081/paymentFunction", {
      cardID: inputs.cardID,
      cardname: inputs.cardname,
      cardnumber: inputs.cardnumber.replace(/\s+/g, ""), // Remove spaces before sending
      cardholdername: inputs.cardholdername,
      expdate: inputs.expdate,
      cvv: inputs.cvv,
      fullname: inputs.fullname,
      email: inputs.email,
    });
  };

  // Save card details to local storage
  const savePaymentToLocalStorage = () => {
    localStorage.setItem("paymentDetails", JSON.stringify(inputs));
  };

  // Function to get the minimum date for expiration date (no past dates allowed)
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Ensure the month is two digits
    return `${year}-${month}`; // Return the minimum date in YYYY-MM format
  };

  return (
    <div className="paymnt_background">
      <HomeNav />
      <div className="payment_from_background">
        <div className="form_full_payment">
          <div className="payment_from_full">
            <h1 className="form_head_payment">Add New Card </h1>
            <form className="payment-form" onSubmit={handleSubmit}>
              <div className="input_groupfrom">
                <div className="form-group">
                  <label className="form-label" htmlFor="clinicname">
                    cardID:
                  </label>
                  <br />
                  <input
                    type="text"
                    id="cardID"
                    name="cardID"
                    className="form-input"
                    value={inputs.cardID}
                    onChange={handleChange}
                    required
                    readOnly
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
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  card name:
                </label>
                <br />
                <input
                  type="text"
                  id="cardname"
                  name="cardname"
                  className="form_input_service"
                  value={inputs.cardname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">card number:</label>
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
                {errors.cardnumber && (
                  <p className="error">{errors.cardnumber}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">card holder name:</label>
                <br />
                <input
                  type="text"
                  id="cardholdername"
                  name="cardholdername"
                  className="form_input_service"
                  value={inputs.cardholdername}
                  onChange={handleChange}
                  required
                />
                {errors.cardholdername && (
                  <p className="error">{errors.cardholdername}</p>
                )}
              </div>
              <div className="input_groupfrom">
                <div className="form-group">
                  <label className="form-label">EXP date:</label>
                  <br />
                  <input
                    type="month"
                    id="expdate"
                    name="expdate"
                    min={getMinDate()}
                    className="form-input"
                    value={inputs.expdate}
                    onChange={handleChange}
                    required
                  />
                  {errors.expdate && <p className="error">{errors.expdate}</p>}
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
                    maxLength={4}
                  />
                  {errors.cvv && <p className="error">{errors.cvv}</p>}
                </div>
              </div>

              <button type="submit" className="submit_btn">
                Add Card
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCard;

