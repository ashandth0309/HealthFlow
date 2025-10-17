import { useLocation } from "react-router-dom";
import "./Home.css";
function HomeNav() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav_active_payment" : "";

  return (
    <div>
      <div className="payment_nav_bar_full">
        <div className="payment_nav_left">
          <h1 className="logo_word">
            Health
            <span className="logo_sub_word">Flow</span>
          </h1>
        </div>
        <div className="payment_nav_right">
          <h3 className={`nav_item_payment1`}>Home</h3>
          <h3 className={`nav_item_payment ${isActive("/services")}`}>
            Services
          </h3>
          <h3 className={`nav_item_payment ${isActive("/about")}`}>About Us</h3>
          <h3
            className={`nav_item_payment ${isActive("/allPayment")}`}
            onClick={() => (window.location.href = "/allPayment")}
          >
            
          </h3>
          <h3
            className={`nav_item_payment ${isActive("/myCard")}`}
            onClick={() => (window.location.href = "/myCard")}
          >
            My Cards
          </h3>
          <h3
            className={`nav_item_payment ${isActive("/addCard")}`}
            onClick={() => (window.location.href = "/addCard")}
          >
            Add Card
          </h3>
          <h3
            className={`nav_item_payment ${isActive("/")}`}
            onClick={() => (window.location.href = "/")}
          >
            Add Payment
          </h3>
          <h3
            className={`nav_item_payment ${isActive("/myPayment")}`}
            onClick={() => (window.location.href = "/myPayment")}
          >
            My Payment
          </h3>
        </div>
      </div>
    </div>
  );
}

export default HomeNav;
