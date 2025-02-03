import React, {useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register-login-page.css";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

axios.defaults.withCredentials = true;

const Login = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
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

  axios.defaults.withCredentials = true;
    
  // Login request
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, //  Allow cookies
        }
      );
  
      if (response.status === 200) {
        setUsername(username);
        localStorage.setItem("usernameValue", JSON.stringify(username));
        navigate("/login-success");
      }
    } catch (error) {
      setErrorMessage(t("login.error")); // Translated error message
      console.log("Error:", error);
    }
  };

  return (
    <div className="custom-outer-div d-flex justify-content-center align-items-center min-vw-100 min-vh-100 p-3">
      <div
        className="custom-user-info-window w-100 p-4 border border-black border-opacity-25 rounded shadow-lg"
        style={{ maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">{t("login.title")}</h3> {/* Translated Login Title */}
        {errorMessage && (
          <p className="text-danger text-center">{errorMessage}</p> 
        )}
        <form id="form" onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">{t("login.username")}</label> {/* Translated Username label */}
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t("login.password")}</label> {/* Translated Password label */}
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              {t("login.cancel")} {/* Translated Cancel button */}
            </button>
            <button className="btn btn-primary" type="submit">
              {t("login.submit")} {/* Translated Submit button */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;