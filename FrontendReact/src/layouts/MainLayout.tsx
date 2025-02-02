import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect} from "react";
import "../styles/main-layout.css";
import { useTheme } from "../context/ThemeContext";

const MainLayout = () => {

  const { theme } = useTheme();
  
  useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  return (
    <div>
      <Navbar />
      <div
        className="main-layout"
        style={{ height: "92vh"}}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
