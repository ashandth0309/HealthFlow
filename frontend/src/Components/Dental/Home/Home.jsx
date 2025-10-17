/* eslint-disable react/no-unescaped-entities */
import DentalNav from "./DentalNav";
import "./Home.css";
import Card1 from "./img/card1.png";
import Card2 from "./img/card2.png";
import Card3 from "./img/card3.png";
import Card4 from "./img/card4.png";
import Card5 from "./img/card5.png";
import Card6 from "./img/card6.png";

function Home() {
  return (
    <div>
      <DentalNav />
      <div className="dental_home_bk">
        <div className="home_dental_body">
          <h1 className="home_topic_dental">
            Keep your smile <br></br>Clean and Great.
          </h1>
          <p className="home_para_dental">
            We are here to make your dental visits effortless.
            <br /> A healthier smile is just a click away!
          </p>
          <button
            onClick={() => (window.location.href = "/addAppointment")}
            className="btn_dental_book"
          >
            Book Appointment
          </button>
          <button
            onClick={() => (window.location.href = "/myAppointment")}
            className="btn_dental_book lft_bn"
          >
            My Appointment
          </button>
        </div>
      </div>
      <div className="dental_home_bk_service">
        <h1 className="topic_data">Available Dental Services</h1>
        <div className="home_service_grid">
          <div className="service_dental_card">
            <img src={Card1} className="imgcard_home_dntal" alt="img" />
            <h1 className="card_topic_dental">
              Routing check-ups and Cleaning
            </h1>
            <p className="card_topic_para">
              Keep your teeth healthy and shining with our comprehensive
              checkups and professional cleanings. Detect issues early and
              maintain optimal oral hygiene with our friendly team.
            </p>
            <p className="card_topic_map">📍 Asiri ,Nawaloka </p>
          </div>
          <div className="service_dental_card">
            <img src={Card2} className="imgcard_home_dntal" alt="img" />
            <h1 className="card_topic_dental">Teeth Whitening</h1>
            <p className="card_topic_para">
              Brighten Your Smile: Illuminate your smile with our professional
              teeth whitening services. Say goodbye to stains and discolouration
              with safe, effective treatments that enhance your teeth’s natural
              brilliance
            </p>
            <p className="card_topic_map">📍Asiri ,Durdance Hospital </p>
          </div>
          <div className="service_dental_card">
            <img src={Card3} className="imgcard_home_dntal" alt="img" />
            <h1 className="card_topic_dental">Cosmetic Dentistry</h1>
            <p className="card_topic_para">
              Transform your smile and Enhance your appearance with our range of
              cosmetic treatments, including teeth whitening, veneers, and
              bonding. Achieve the perfect smile and boost your confidence.
            </p>
            <p className="card_topic_map">📍 Asiri ,Nawaloka </p>
          </div>
          <div className="service_dental_card">
            <img src={Card4} className="imgcard_home_dntal" alt="img" />
            <h1 className="card_topic_dental">Braces</h1>
            <p className="card_topic_para">
              Achieve the smile you've always wanted with our advanced braces
              solutions. Whether you choose traditional metal braces or clear
              aligners, we tailor treatments to align your teeth and enhance
              your smile with precision.
            </p>
            <p className="card_topic_map">📍 Asiri ,Nawaloka </p>
          </div>
          <div className="service_dental_card">
            <img src={Card5} className="imgcard_home_dntal" alt="img" />
            <h1 className="card_topic_dental">Root Canal Theraphy</h1>
            <p className="card_topic_para">
              Don’t let tooth pain hold you back. Our gentle root canal therapy
              addresses deep tooth infections and restores your tooth’s health,
              relieving discomfort and preserving your natural smile.
            </p>
            <p className="card_topic_map">📍 Nawaloka </p>
          </div>
          <div className="service_dental_card">
            <img src={Card6} className="imgcard_home_dntal" alt="img" />
            <h1 className="card_topic_dental">Wisdom Teeth Removal</h1>
            <p className="card_topic_para">
              Experience relief with our expert wisdom teeth removal. We handle
              extraction with care, ensuring a smooth recovery and addressing
              any pain or complications caused by impacted or problematic wisdom
              teeth.
            </p>
            <p className="card_topic_map">📍 Asiri ,Nawaloka </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
