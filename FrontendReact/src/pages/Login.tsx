import React, { useContext, useState } from "react";
import "../styles/register-login-page.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext, UserProvider } from "../context/UserContext";

const Login = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const handleLogin = () => {
    axios
      .post(`${baseUrl}/auth/login`, {
        username: username,
        password: password,
      })
      .then((r) => {
        console.log(r);
        navigate(`/`);
      })
      .catch((err) => console.log("Error: " + err));
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="custom-outer-div d-flex justify-content-center align-items-center min-vw-100 min-vh-100">
      <div className="custom-user-info-window w-25 p-4 border border-black border-opacity-25">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
