import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import axiosWithLogout from "../axios";

const Navbar = () => {
  const [displayLanguages, setDisplayLanguages] = useState(false);
  const [displayUserMenu, setDisplayUserMenu] = useState(false);

  const languageContext = useContext(LanguageContext);

  if (!languageContext) {
    throw new Error("LanguageContext must be used within a LanguageProvider.");
  }

  const { username, setUsername } = useUserContext();
  const { language, setLanguage } = languageContext;
  const { theme, toggleTheme } = useTheme();

  const { translate : translate } = languageContext; // Now `context` is guaranteed to be defined

  const languagesMenuColor = "#a0091b";

  // Logout request
  const handleLogout = async () => {
      const response = await axiosWithLogout.post("/auth/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, //  Allow cookies
        }
      );

      if (response.status === 200) {
        setUsername(null);
        console.log("User logged out");
      }
  };

  const closeDropdowns = () => {
    setDisplayLanguages(false);
    setDisplayUserMenu(false);
  };

  const handleLanguagesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayLanguages((prev) => {
      if (!prev) setDisplayUserMenu(false);
      return !prev;
    });
  };

  const handleUserMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayUserMenu((prev) => {
      if (!prev) setDisplayLanguages(false);
      return !prev;
    });
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setDisplayLanguages(false);
  };

  useEffect(() => {
    const handleClickOutside = () => closeDropdowns();
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand custom-navbar">
      <div className="container-fluid">
        <button className="navbar-toggler bg-white" type="button"></button>
        <div className="collapse navbar-collapse text-center">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/rules" className="nav-link text-white">
                {translate("rules.navbar")}
              </Link>
            </li>
            <li>
              <Link to="/players-ranking" className="nav-link text-white">
                {translate("ranking.navbar")}
              </Link>
            </li>
          </ul>
          <div
            className="user-info"
            style={{ color: "#ffffff", fontSize: "1.5rem", marginRight: "10px" }}
          >
            {username != null ? (
              username
            ) : (
              ""
            )}
          </div>
          <div
            className="dark-button"
            role="button"
            onClick={toggleTheme}
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
          >
            {theme === "light" ? (
              <i className="bi bi-moon"></i>
            ) : (
              <i className="bi bi-sun"></i>
            )}
          </div>
          <ul className="list-group list-group-horizontal list-unstyled me-4">
            <li className="dropdown me-3 mt-1">
              <button
                className="nav-link dropdown-toggle text-white"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleLanguagesClick}
              >
                {language}
              </button>
              <ul
                className={`dropdown-menu custom-dropdown-menu border border-black border-2 ${
                  displayLanguages && "show"
                }`}
                style={{ backgroundColor: languagesMenuColor }}
              >
                {["EN", "PL", "IT", "RGN"].map((lang) => (
                  <li key={lang}>
                    <button
                      className="dropdown-item text-white custom-dropdown-item"
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
            <li className="dropdown">
              {/* Change icon dynamically based on login state */}
              <i
                className={`bi ${
                  username ? "bi-person-circle" : "bi-door-open"
                } text-white fs-4`}
                onClick={handleUserMenuClick}
                style={{ cursor: "pointer" }}
              ></i>
              <ul
                className={`dropdown-menu custom-dropdown-menu border border-black border-2 ${
                  displayUserMenu && "show"
                }`}
                style={{
                  backgroundColor: languagesMenuColor,
                  right: 0,
                  left: "auto",
                }}
              >
                {!username ? (
                  <>
                    <li>
                      <Link
                        to="/register"
                        className="dropdown-item text-white custom-dropdown-item"
                      >
                        {translate("register.title")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="dropdown-item text-white custom-dropdown-item"
                      >
                        {translate("login.title")}
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-white custom-dropdown-item"
                    >
                      {translate("logout")}
                    </button>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
