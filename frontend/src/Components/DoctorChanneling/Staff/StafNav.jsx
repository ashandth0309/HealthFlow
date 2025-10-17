import { useLocation } from "react-router-dom";
import "./staff.css";
function StafNav() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav_active_doctor" : "";

  return (
    <div>
      <div className="doctor_nav_bar_full">
        <div className="doctor_nav_left">
          <h1 className="logo_word">
            HealthFlow
            <span className="logo_sub_word">Staff</span>
          </h1>
        </div>
        <div className="doctor_nav_right">
          <h3
            className={`nav_item_doctor ${isActive("/stafdash")}`}
            onClick={() => (window.location.href = "/stafdash")}
          >
            Session
          </h3>
          <h3
            className={`nav_item_doctor ${isActive("/allAppoiment")}`}
            onClick={() => (window.location.href = "/allAppoiment")}
          >
            Appointment
          </h3>
        </div>
      </div>
    </div>
  );
}

export default StafNav;
