import { useState } from "react";
import loginVector from "./img/log.jpg";

function AdmitLog() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials
    const validUsername = "staf";
    const validPassword = "123";

    if (username === validUsername && password === validPassword) {
      alert("Login successful");
      window.location.href = "/adminAdmit";
    } else {
      alert("Invalid login");
    }
  };
  return (
    <div className="log_box">
      <div>
        <h3 className="login_topic">Admit manager Login</h3>
        <div className="box_container_log">
          <div>
            <img src={loginVector} alt="logvectoe" className="logvector" />
          </div>
          <div className="staf_login">
            <form className="staf_login-form" onSubmit={handleLogin}>
              <div className="staf_login-field">
                <label className="staf_login-label" htmlFor="username">
                  Username:
                </label>
                <input
                  className="staf_login-input"
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="staf_login-field">
                <label className="staf_login-label" htmlFor="password">
                  Password:
                </label>
                <input
                  className="staf_login-input"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="submit_btn" type="submit">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdmitLog;
