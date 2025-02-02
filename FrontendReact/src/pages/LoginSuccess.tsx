import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register-login-page.css";
import { useTheme } from "../context/ThemeContext";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage after a short delay
    setTimeout(() => {
      navigate("/");
    }, 100); // 100ms delay
  }, [navigate]);

  const { theme } = useTheme();
    
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
      }, [theme]);

  return (
    <div className="register-login-page min-vw-100 min-vh-100">
      
    </div>
  );
};

export default LoginSuccess;