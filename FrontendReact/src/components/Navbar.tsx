import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [displayLanguages, setDisplayLanguages] = useState(false);
  const languagesMenuColor = "#a0091b";
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
                <Link to="/" className="nav-link text-white">
                  Rules
                </Link>
              </li>
            </ul>
            {/* languages menu */}
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
                </ul>
              </li>
              <li className="">
                <Link to="/">
                  <i className="bi bi-person-circle text-white fs-4 "></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
