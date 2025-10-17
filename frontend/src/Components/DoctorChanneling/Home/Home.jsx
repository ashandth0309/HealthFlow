/* eslint-disable react/no-unescaped-entities */
import "./Home.css";
import HomeNav from "./HomeNav";
function Home() {
  return (
    <div>
      <HomeNav />
      <div className="doctor_home_bk">
        <div className="home_doctor_body">
          <h1 className="home_topic_doctor">
            Book Your <br></br> Appointments at Ease
          </h1>
          <p className="home_para_doctor">
            "Your health is our top priority. We provide safe and reliable care,<br/><br/>
            with personalized treatments tailored to <br/><br/>meet your specific needs"
          </p>
          <button
            onClick={() => (window.location.href = "/SessionDetails")}
            className="btn_doctor_book"
          >
            Book Appointment
          </button>&nbsp;&nbsp;&nbsp;&nbsp;
          <button
            onClick={() => (window.location.href = "/myAppoiment")}
            className="btn_doctor_book lft_bn"
          >
            My Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
