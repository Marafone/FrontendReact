import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import "../styles/register-login-page.css";

axios.defaults.withCredentials = true;

const Login = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { setUsername } = useUserContext(); // global context

  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        username: formUsername,
        password: formPassword,
      });

      if (response.status === 200) {
        // Login successful, set the global username and redirect
        setUsername(formUsername);
        navigate(`/`);
      }
    } catch (err) {
      // Handle login failure
      setErrorMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleCancel = () => {
    navigate(`/`);
  };

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
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" onClick={handleLogin}>
            Submit
          </button>
        </div>
        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;