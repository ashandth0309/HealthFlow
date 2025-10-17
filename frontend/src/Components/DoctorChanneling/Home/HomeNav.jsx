import { useLocation } from "react-router-dom";
import "./Home.css";

function HomeNav() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav_active_doctor" : "";

  return (
    <div>
      <div className="doctor_nav_bar_full">
        <div className="doctor_nav_left">
          <h1 className="logo_word">
            Health
            <span className="logo_sub_word">Flow</span>
          </h1>
        </div>
        <div className="doctor_nav_right">
          <h3
            className={`nav_item_doctor ${isActive("/homepage")}`}
            onClick={() => (window.location.href = "/homepage")}
          >
            Home
          </h3>

          <h3
            onClick={() => (window.location.href = "/sessionDetails")}
            className={`nav_item_doctor ${isActive("/sessionDetails")}`}
          >
            Sessions
          </h3>

          <h3
            className={`nav_item_doctor ${isActive("/myAppoiment")}`}
            onClick={() => (window.location.href = "/myAppoiment")}
          >
            My Appointment
          </h3>
        </div>
      </div>
    </div>
  );
}

export default HomeNav;
