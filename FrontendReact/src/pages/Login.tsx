import React, {useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register-login-page.css";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useUserContext } from "../context/UserContext";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const context = useContext(LanguageContext);

  const { setUsername: setUsernameContext } = useUserContext();

  if (!context) {
    throw new Error("LanguageContext must be used within a LanguageProvider.");
  }

  const { translate } = context; // Now `context` is guaranteed to be defined

  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
    
  // Login request
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/auth/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        const response = await axios.get("/user/info");
        setUsernameContext(response.data.username);
        navigate("/login-success");
      }
    } catch (error) {
      setErrorMessage(translate("login.error"));
      console.log("Error:", error);
    }
  };

  return (
    <div className="custom-outer-div d-flex justify-content-center align-items-center min-vw-100 min-vh-100 p-3">
      <div
        className="custom-user-info-window w-100 p-4 border border-black border-opacity-25 rounded shadow-lg"
        style={{ maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">{translate("login.title")}</h3> {/* Login Title */}
        {errorMessage && (
          <p className="text-danger text-center">{errorMessage}</p> 
        )}
        <form id="form" onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">{translate("login.username")}</label> {/* Username label */}
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{translate("login.password")}</label> {/* Password label */}
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Register Link */}
          <p className="text-center">
            <a href="#" onClick={() => navigate("/register")}>
              {translate("login.register")} {/* Register link */}
            </a>
          </p>
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" type="button" onClick={() => navigate("/")}>
              {translate("login.cancel")} {/* Cancel button */}
            </button>
            <button className="btn btn-primary" type="submit">
              {translate("login.submit")} {/* Submit button */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;