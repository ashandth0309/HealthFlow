import { useLocation } from "react-router-dom";
function StafNav() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav_active_dental" : "";

  return (
    <div>
      <div className="Dental_nav_bar_full">
        <div className="Dental_nav_left">
          <h1 className="logo_word">
            HealthHugs
            <span className="logo_sub_word">Staff</span>
          </h1>
        </div>
        <div className="Dental_nav_right">
          <h3
            className={`nav_item_dental ${isActive("/stafhome")}`}
            onClick={() => (window.location.href = "/stafhome")}
          >
            Appointment
          </h3>
          <h3
            className={`nav_item_dental ${isActive("/clinic")}`}
            onClick={() => (window.location.href = "/clinic")}
          >
            Clinic
          </h3>
          <h3
            className={`nav_item_dental ${isActive("/dochome")}`}
            onClick={() => (window.location.href = "/dochome")}
          >
            Doctors
          </h3>
        </div>
      </div>
    </div>
  );
}

export default StafNav;
