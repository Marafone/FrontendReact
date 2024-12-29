import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [displayLanguages, setDisplayLanguages] = useState(false);
  const [displayUserMenu, setDisplayUserMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state here
  const languagesMenuColor = "#a0091b";

  const handleLogout = () => {
    setIsLoggedIn(false); // Log out logic
    console.log("User logged out");
  };

  return (
    <>
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
            {/* Languages menu */}
            <ul className="list-group list-group-horizontal list-unstyled me-4">
              <li className="dropdown me-3 mt-1">
                <button
                  className="nav-link dropdown-toggle text-white"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => setDisplayLanguages(!displayLanguages)}
                >
                  Language
                </button>
                <ul
                  className={`dropdown-menu custom-dropdown-menu border border-black border-2 ${
                    displayLanguages && "show"
                  }`}
                  style={{ backgroundColor: languagesMenuColor }}
                >
                  <li>
                    <button className="dropdown-item text-white custom-dropdown-item">
                      EN
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item text-white custom-dropdown-item">
                      PL
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item text-white custom-dropdown-item">
                      IT
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item text-white custom-dropdown-item">
                      RGN
                    </button>
                  </li>
                </ul>
              </li>
              <li className="dropdown">
                <i
                  className="bi bi-person-circle text-white fs-4"
                  onClick={() => setDisplayUserMenu(!displayUserMenu)}
                  style={{ cursor: "pointer" }}
                ></i>
                <ul
                  className={`dropdown-menu custom-dropdown-menu border border-black border-2 ${
                    displayUserMenu && "show"
                  }`}
                  style={{
                    backgroundColor: languagesMenuColor,
                    right: 0, // Align the menu to the right to prevent overflow
                    left: "auto",
                  }}
                >
                  {!isLoggedIn ? (
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
    </>
  );
};

export default Navbar;