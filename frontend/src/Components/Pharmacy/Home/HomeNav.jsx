import { useLocation } from "react-router-dom";
import "./Home.css";

function HomeNav() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav_active_pharmacy" : "";

  return (
    <div>
      <div className="pharmacy_nav_bar_full">
        <div className="pharmacy_nav_left">
          <h1 className="logo_word">
            Health
            <span className="logo_sub_word">Flow</span>
          </h1>
        </div>
        <div className="pharmacy_nav_right">
          <h3
            className={`nav_item_pharmacy ${isActive("/homepage")}`}
            onClick={() => (window.location.href = "/homepage")}
          >
            Home
          </h3>
          <h3
            className={`nav_item_pharmacy ${isActive("/myorders")}`}
            onClick={() => (window.location.href = "/myorders")}
          >
            My Order
          </h3>
         
       
          <h3
            className={`nav_item_pharmacy ${isActive("/faq")}`}
            onClick={() => (window.location.href = "/faq")}
          >
            FAQ
          </h3>
        </div>
      </div>
    </div>
  );
}

export default HomeNav;
