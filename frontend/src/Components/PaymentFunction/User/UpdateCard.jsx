import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import HomeNav from "../Home/HomeNav";

function UpdateCard() {
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
  const history = useNavigate();
  const id = useParams().id;

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

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/paymentFunction/${id}`
        );
        setInputs(response.data.paymentFunction);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:8081/paymentFunction/${id}`, {
      cardID: String(inputs.cardID),
      cardname: String(inputs.cardname),
      cardnumber: String(inputs.cardnumber.replace(/\s+/g, "")), // Remove spaces before sending
      cardholdername: String(inputs.cardholdername),
      expdate: String(inputs.expdate),
      cvv: String(inputs.cvv),
      fullname: String(inputs.fullname),
      email: String(inputs.email),
    });
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs before sending request
    if (!validateInputs()) return;

    // Send request if validation is successful
    await sendRequest();
    window.alert("Updated successfully!");
    history("/myCard");
  };

  return (
    <div className="paymnt_background">
      <HomeNav />
      <div className="payment_from_background">
        <div className="form_full_payment">
          <div className="payment_from_full">
            <h1 className="form_head_payment">Update Card Details</h1>
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
                {errors.cardname && <p className="error">{errors.cardname}</p>}
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
                Update Card
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateCard;
