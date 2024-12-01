import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const containerColor = "#FFC058";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div
        className="container-fluid"
        style={{ height: "92vh", background: containerColor }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
