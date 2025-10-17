import { useLocation } from "react-router-dom";
import "./Home.css";

function HomeNav() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav_active_admit" : "";

  return (
    <div>
      <div className="admit_nav_bar_full">
        <div className="admit_nav_left">
          <h1 className="logo_word">
            Health
            <span className="logo_sub_word">Flow</span>
          </h1>
        </div>
        <div className="admit_nav_right">
          <h3
            className={`nav_item_admit ${isActive("/homepage")}`}
            onClick={() => (window.location.href = "/homepage")}
          >
            Home
          </h3>
          
          <h3
            className={`nav_item_admit ${isActive("/admitdetails")}`}
            onClick={() => (window.location.href = "/admitdetails")}
          >
            My Admit details
          </h3>
         
        </div>
      </div>
    </div>
  );
}

export default HomeNav;
