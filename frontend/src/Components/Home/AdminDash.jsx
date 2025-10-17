import Admit from "./img/admit.webp";
import Chanal from "./img/chanal.png";
import Tele from "./img/Tele.avif";
import Pharmacy from "./img/pharmacy.png";
import Payment from "./img/payment.jpg";
function AdminDash() {
  return (
    <div>
      <div className="section" id="services">
        <p className="topic_set">Welcome back admin</p>
        <div className="hoomset">
          <div
            className="card_home"
            onClick={() => (window.location.href = "/stafPharmacylog")}
          >
            <img src={Pharmacy} alt="" className="card_imgg" />
            pharmacy management
          </div>
          <div
            className="card_home"
            onClick={() => (window.location.href = "/DoctorLogin")}
          >
            <img src={Tele} alt="" className="card_imgg" />
            telemedicine management
          </div>
          <div
            className="card_home"
            onClick={() => (window.location.href = "/chanallog")}
          >
            <img src={Chanal} alt="" className="card_imgg" />
            Channel management
          </div>
          <div
            className="card_home"
            onClick={() => (window.location.href = "/admitlog")}
          >
            <img src={Admit} alt="" className="card_imgg" />
            Admit management
          </div>
          {/*<div
            className="card_home"
            onClick={() => (window.location.href = "/DoctorLogin")}
          >
            <img src={Doctor} alt="" className="card_imgg" />
            doctor management
          </div>*/}
          <div
            className="card_home"
            onClick={() => (window.location.href = "/paymentLogin")}
          >
            <img src={Payment} alt="" className="card_imgg" />
            payment management
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDash;
