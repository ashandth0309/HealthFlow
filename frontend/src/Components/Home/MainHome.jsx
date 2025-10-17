/* eslint-disable react/no-unescaped-entities */
import "./home.css";
import Back from "./img/img.avif";
function MainHome() {
  return (
    <div>
      <div className="homemain_new">
        <div className="home_main_colum">
          <p className="main_topic">
            <span>your health</span> our priority
          </p>
          <p className="pera">
            Your health is our priority at HealthFlow. We're here to support your
            well-being with care and expertise.
          </p>
          <button
            className="btn_book"
            onClick={() => (window.location.href = "/homepage")}
          >
            User
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            className="btn_book"
            onClick={() => (window.location.href = "/admindashHomelogin")}
          >
            Admin
          </button>
        </div>
        <div>
          <img src={Back} className="imghome_pagee" alt="img/backimg" />
        </div>
      </div>
    </div>
  );
}

export default MainHome;
