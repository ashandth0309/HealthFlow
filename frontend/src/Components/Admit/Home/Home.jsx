import { useNavigate } from "react-router-dom";
import HomeNav from "./HomeNav";

function Home() {
  const navigate = useNavigate();

  const handleAddNewClick = () => {
    navigate("/addadmit"); // Navigate to the Add Admit page
  };

  const handleViewDetailsClick = () => {
    navigate("/admitdetails"); // Navigate to the Add Admit page
  };
  return (
    <div className="home-container">
      <HomeNav />
      <div className="admit_home_bk">
        <div className="home_admit_body">
          <h1 className="home_topic_admit">
            <span className="main_name_admit_home">We are here to </span>
            <br></br>Make your Med-Stay, <br></br>your Home-Stay
          </h1>
          <p className="home_para_admit">
            Your health is our priority. We ensure safe and <br /> reliable
            medication, tailored to your needs.
          </p>
          <button onClick={handleAddNewClick} className="btn_admit_book">
            Admit Now
          </button>
          <button
            onClick={handleViewDetailsClick}
            className="btn_admit_book lft_bn"
          >
            My Admit Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
