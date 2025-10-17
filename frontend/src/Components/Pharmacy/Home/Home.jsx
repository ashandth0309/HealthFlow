/* eslint-disable react/no-unescaped-entities */
import "./Home.css";
import HomeNav from "./HomeNav";
function Home() {
  return (
    <div>
      <HomeNav />
      <div className="pharmacy_home_bk">
        <div className="home_pharmacy_body">
          <h1 className="home_topic_pharmacy">
            Keep your smile <br></br>Clean and Great.
          </h1>
          <p className="home_para_pharmacy">
            Your health is our priority. We ensure safe and <br /> reliable
            medication, tailored to your needs.
          </p>
          <button
            onClick={() => (window.location.href = "/addorder")}
            className="btn_pharmacy_book"
          >
            Order Medicine
          </button>
          <button
            onClick={() => (window.location.href = "/myorders")}
            className="btn_pharmacy_book lft_bn"
          >
            My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
