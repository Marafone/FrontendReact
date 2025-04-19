import {useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register-login-page.css";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

axios.defaults.withCredentials = true;

const Register = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("LanguageContext must be used within a LanguageProvider.");
  }

  const { translate } = context; // Now `context` is guaranteed to be defined

  const { theme } = useTheme();
  
  useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  const handleRegister = () => {
    axios
      .post(`${baseUrl}/auth/register`, { username, email, password })
      .then((response) => {
        if (response.status === 201) {
          navigate("/login");
        }else{
          setErrorMessage(translate("register.error"));
        }
      })
      .catch((error) => {
        setErrorMessage(translate("register.error"));
        console.log("Error:", error);
      });
  };

  return (
    <div className="register-login-page custom-outer-div d-flex justify-content-center align-items-center min-vw-100 min-vh-100 p-3">
      <div className="custom-user-info-window w-100 p-4 border border-black border-opacity-25 rounded shadow-lg" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">{translate("register.title")}</h3> {/* Register Title */}
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>} {/* Error Message */}
        
        <div className="mb-3">
          <label className="form-label">{translate("register.username")}</label> {/* Username label */}
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{translate("register.email")}</label> {/* Email label */}
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{translate("register.password")}</label> {/* Password label */}
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Login Link */}
        <p className="text-center">
          <a href="#" onClick={() => navigate("/login")}>
            {translate("register.login")} {/* Login link */}
          </a>
        </p>
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            {translate("register.cancel")} {/* Cancel button */}
          </button>
          <button className="btn btn-primary" onClick={handleRegister}>
            {translate("register.submit")} {/* Submit button */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;