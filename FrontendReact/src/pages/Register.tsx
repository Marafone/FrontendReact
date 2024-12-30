import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register-login-page.css";

axios.defaults.withCredentials = true;

const Register = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = () => {
    axios
      .post(`${baseUrl}/auth/register`, { username, email, password })
      .then((response) => {
        if (response.status === 201) {
          navigate("/");
        }
      })
      .catch((error) => {
        setErrorMessage("Registration failed. Please try again.");
        console.log("Error:", error);
      });
  };

  return (
    <div className="custom-outer-div d-flex justify-content-center align-items-center min-vw-100 min-vh-100 p-3">
      <div className="custom-user-info-window w-100 p-4 border border-black border-opacity-25 rounded shadow-lg" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Register</h2>
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleRegister}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;