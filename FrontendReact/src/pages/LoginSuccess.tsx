import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage after a short delay
    setTimeout(() => {
      navigate("/");
    }, 1000); // 1-second delay
  }, [navigate]);

  return (
    <div>
      
    </div>
  );
};

export default LoginSuccess;