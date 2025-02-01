import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage after a short delay
    setTimeout(() => {
      navigate("/");
    }, 100); // 100ms delay
  }, [navigate]);

  return (
    <div>
      
    </div>
  );
};

export default LoginSuccess;