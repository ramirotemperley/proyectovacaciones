// src/components/Navbar/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand mx-3" to="/">
          Mks Vacaciones
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav">
            {/* Menú desplegable para Empleados */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Empleados
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <Link className="dropdown-item" to="/agregar-empleado">
                    Agregar Empleado
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/empleados">
                    Lista de Empleados
                  </Link>
                </li>
              </ul>
            </li>
            {/* Enlace a Vacaciones */}
            <li className="nav-item">
              <Link className="nav-link" to="/vacaciones">
                Vacaciones
              </Link>
            </li>
            {/* Enlace a Líneas de Ferrocarril */}
            <li className="nav-item">
              <Link className="nav-link" to="/lines">
                Líneas de Ferrocarril
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
