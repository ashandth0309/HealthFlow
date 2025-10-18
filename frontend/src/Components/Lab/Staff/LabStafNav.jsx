import { useLocation } from "react-router-dom";
import "./lab.css";

function LabStafNav() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav_active_lab" : "";

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/admindashHomelogin";
  };

  return (
    <div className="lab_sidebar">
      <div className="lab_sidebar_header">
        <h1 className="logo_word_sidebar">
          HealthFlow
          <span className="logo_sub_word_sidebar">Lab</span>
        </h1>
        <p style={{ color: '#ddd', fontSize: '12px', marginTop: '5px' }}>
          Admin Dashboard
        </p>
      </div>
      
      <div className="lab_nav_items">
        <div
          className={`lab_nav_item ${isActive("/labOrders")}`}
          onClick={() => (window.location.href = "/labOrders")}
        >
          🧪 Lab Orders
        </div>
        <div
          className={`lab_nav_item ${isActive("/labResults")}`}
          onClick={() => (window.location.href = "/labResults")}
        >
          📊 Lab Results
        </div>
        <div
          className={`lab_nav_item ${isActive("/adverseReactions")}`}
          onClick={() => (window.location.href = "/adverseReactions")}
        >
          ⚠️ Adverse Reactions
        </div>
        <div
          className={`lab_nav_item ${isActive("/pharmacyInventory")}`}
          onClick={() => (window.location.href = "/pharmacyInventory")}
        >
          💊 Pharmacy Inventory
        </div>
        <div
          className={`lab_nav_item ${isActive("/doctorReviews")}`}
          onClick={() => (window.location.href = "/doctorReviews")}
        >
          👨‍⚕️ Doctor Reviews
        </div>
        <div
          className={`lab_nav_item ${isActive("/billing")}`}
          onClick={() => (window.location.href = "/billing")}
        >
          💰 Billing Management
        </div>
        
        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '20px 0' }}></div>
        
        {/* Back to Admin Dashboard */}
        <div
          className="lab_nav_item"
          onClick={() => (window.location.href = "/admindashHome")}
        >
          🏠 Admin Dashboard
        </div>
        
        {/* Logout */}
        <div
          className="lab_nav_item"
          onClick={handleLogout}
          style={{ marginTop: 'auto', backgroundColor: 'rgba(255,0,0,0.2)' }}
        >
          🚪 Logout
        </div>
      </div>
    </div>
  );
}

export default LabStafNav;