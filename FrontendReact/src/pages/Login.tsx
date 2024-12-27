import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "../styles/register-login-page.css";

axios.defaults.withCredentials = true;

const Login = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const handleLogin = () => {
    axios
      .post(`${baseUrl}/auth/login`, {
        username: formUsername,
        password: formPassword,
      })
      .then((r) => {
        console.log(r);
        setUsername(formUsername);
        navigate(`/`);
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const navigate = useNavigate();
  const { username, setUsername } = useUserContext(); // global context

  return (
    <div className="custom-outer-div d-flex justify-content-center align-items-center min-vw-100 min-vh-100">
      <div className="custom-user-info-window w-25 p-4 border border-black border-opacity-25">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={formUsername}
            onChange={(e) => setFormUsername(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
          ></input>
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleLogin}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
