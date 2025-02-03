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

  const { t } = context; // Now `context` is guaranteed to be defined

  const { theme } = useTheme();
  
  useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  const handleRegister = () => {
    axios
      .post(`${baseUrl}/auth/register`, { username, email, password })
      .then((response) => {
        if (response.status === 201) {
          navigate("/");
        }
      })
      .catch((error) => {
        setErrorMessage(t("register.error")); // Translated error message
        console.log("Error:", error);
      });
  };

  return (
    <div className="register-login-page custom-outer-div d-flex justify-content-center align-items-center min-vw-100 min-vh-100 p-3">
      <div className="custom-user-info-window w-100 p-4 border border-black border-opacity-25 rounded shadow-lg" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">{t("register.title")}</h3> {/* Translated Register Title */}
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>} {/* Translated Error Message */}
        
        <div className="mb-3">
          <label className="form-label">{t("register.username")}</label> {/* Translated Username label */}
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t("register.email")}</label> {/* Translated Email label */}
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t("register.password")}</label> {/* Translated Password label */}
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            {t("register.cancel")} {/* Translated Cancel button */}
          </button>
          <button className="btn btn-primary" onClick={handleRegister}>
            {t("register.submit")} {/* Translated Submit button */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;