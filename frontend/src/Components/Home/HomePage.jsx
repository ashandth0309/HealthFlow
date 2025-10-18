import "./home.css";
import Admit from "./img/admit.webp";
import Chanal from "./img/chanal.png";
import Dental from "./img/tele.avif";
import Pharmacy from "./img/pharmacy.png";
import Pro from "./img/pro.png";
import Logo from "./img/logo.jpg";
import Lab from "./img/pharmacy.png";
import Prescription from "./img/pharmacy.png";

function HomePage() {
  return (
    <div>
      <div>
        <nav className="nav_bar_full">
          <div>
            <img src={Logo} alt="" className="logo_navv" />
          </div>
          <div className="itemset">
            <a className="nav_item" href="#services">
              Services
            </a>
            <a className="nav_item" href="#about">
              About Us
            </a>
            <a className="nav_item" href="#contact">
              Contact Us
            </a>
            <img src={Pro} className="proo" />
          </div>
        </nav>
      </div>
      <div>
        <div className="cover_home">
          <div>
            <p className="home_topicc">
              Health<span className="home_subtopic">flow</span>
            </p>
            <p className="para_home">
              We're here to support your journey to better health and lasting
              strength.
            </p>
          </div>
          <div className="image_homepart"></div>
        </div>
      </div>
      <div className="section" id="services">
        <p className="topic_set">OUR SERVICES</p>
        <div className="hoomset">
          <div
            className="card_home"
            onClick={() => (window.location.href = "/pharmacyHome")}
          >
            <img src={Pharmacy} alt="" className="card_imgg" />
            pharmacy management
          </div>
          <div
            className="card_home"
            onClick={() => (window.location.href = "/dentalHome")}
          >
            <img src={Dental} alt="" className="card_imgg" />
            Dental Services
          </div>
          <div
            className="card_home"
            onClick={() => (window.location.href = "/homeChannal")}
          >
            <img src={Chanal} alt="" className="card_imgg" />
            Channel management
          </div>
          <div
            className="card_home"
            onClick={() => (window.location.href = "/admithome")}
          >
            <img src={Admit} alt="" className="card_imgg" />
            Inpatient management
          </div>
          <div
            className="card_home"
            onClick={() => (window.location.href = "/myLabResults")}
          >
            <img src={Lab} alt="" className="card_imgg" />
            My Lab Results
          </div>
          <div
            className="card_home"
            onClick={() => (window.location.href = "/myPrescriptions")}
          >
            <img src={Prescription} alt="" className="card_imgg" />
            My Prescriptions
          </div>
        </div>
      </div>
      <div className="bkselct" id="about">
        <div className="section ">
          <p className="topic_set">About us</p>
          <p className="about_us">
            HealthFlow is a leading, innovative healthcare management platform
            designed to revolutionize the healthcare experience for both
            providers and patients. We offer comprehensive, cutting-edge
            solutions that streamline healthcare processes, improve patient
            care, and optimize hospital and clinic workflows. By leveraging
            advanced technology and data-driven insights, HealthFlow helps
            healthcare providers reduce operational costs, enhance service
            quality, and ultimately improve patient outcomes. Our platform is
            dedicated to fostering a higher quality of life for patients through
            personalized care management, while enabling healthcare
            professionals to focus more on what matters most: delivering
            exceptional care. Partner with HealthFlow for a healthier, more
            efficient future in healthcare.
          </p>
        </div>
      </div>
      <div className="section" id="contact">
        <div>
          <p className="topic_set">Contact us</p>
          <div className="contact_us">
            <div>
              <div className="map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63375.282265340706!2d79.82781946774308!3d6.8959691886387295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25b66ba5332f1%3A0x255c8ea30781acda!2sColombo%20Health%20Centre!5e0!3m2!1sen!2slk!4v1728114686335!5m2!1sen!2slk"
                  allowFullScreen=""
                  loading="lazy"
                  className="map"
                ></iframe>
              </div>
            </div>
            <div className="datacalcon">
              <p>Email: 123@healthflow.com</p>
              <p>Phone: (123) 456-7890</p>
              <p>Address: 123 Main St, Colombo 10, Colombo 10, 8503</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="foooter">
        <p>© 2025 HealthFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
