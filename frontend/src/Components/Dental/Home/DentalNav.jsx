import { useLocation } from "react-router-dom";
import "./Home.css";

function DentalNav() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav_active_dental" : "";

  return (
    <div>
      <div className="Dental_nav_bar_full">
        <div className="Dental_nav_left">
          <h1 className="logo_word">
            Health
            <span className="logo_sub_word">Hugs</span>
          </h1>
        </div>
        <div className="Dental_nav_right">
          <h3
            className={`nav_item_dental ${isActive("/homepage")}`}
            onClick={() => (window.location.href = "/homepage")}
          >
            Home
          </h3>
          <h3
            className={`nav_item_dental ${isActive("/myAppointment")}`}
            onClick={() => (window.location.href = "/myAppointment")}
          >
            My Appointment
          </h3>
        
          <h3
            className={`nav_item_dental ${isActive("/faqdental")}`}
            onClick={() => (window.location.href = "/faqdental")}
          >
            FAQ
          </h3>
        </div>
      </div>
    </div>
  );
}

export default DentalNav;
