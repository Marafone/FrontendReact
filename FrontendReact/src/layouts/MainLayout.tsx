import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import "../styles/main-layout.css";
import { useTheme } from "../context/ThemeContext";

const MainLayout = () => {
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const centeredRoutes = ["/players-ranking", "/create-game"];
  const isCentered = centeredRoutes.includes(location.pathname);

  return (
    <div>
      <Navbar />
      <div
        className={`${
          isCentered ? "d-flex justify-content-center align-items-center" : ""
        } main-layout`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
