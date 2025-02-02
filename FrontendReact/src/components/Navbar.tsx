import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { LanguageContext } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [displayLanguages, setDisplayLanguages] = useState(false);
  const [displayUserMenu, setDisplayUserMenu] = useState(false);
  
  const { username, setUsername } = useContext(UserContext);
  const { language, setLanguage } = useContext(LanguageContext); // Access language context

  const { theme, toggleTheme } = useTheme();

  const languagesMenuColor = "#a0091b";

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem("username");
    console.log("User logged out");
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
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/rules" className="nav-link text-white">
                Rules
              </Link>
            </li>
          </ul>
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
                Language ({language})
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
              <i
                className="bi bi-person-circle text-white fs-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayUserMenu((prev) => !prev);
                }}
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
                        Register
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="dropdown-item text-white custom-dropdown-item"
                      >
                        Login
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-white custom-dropdown-item"
                    >
                      Logout
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