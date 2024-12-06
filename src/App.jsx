import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import AgregarEmpleado from "./pages/AgregarEmpleado";
import Empleados from "./pages/Empleados";
import Vacations from "./pages/Vacations";
import LinesPage from "./pages/LinesPage";
import { EmployeeProvider } from "./contexts/EmployeeContext";
import { VacationsProvider } from "./contexts/VacationsContext";
import { LinesProvider } from "./contexts/LinesContext";

function App() {
  return (
    <EmployeeProvider>
      <VacationsProvider>
        <LinesProvider>
          <Router basename="/control">
            <div className="app-container">
              <Navbar />
              <div className="content">
                <Routes>
                  {/* Redirigir la ruta base al listado de empleados */}
                  <Route path="/" element={<Navigate to="/empleados" />} />
                  <Route path="/agregar-empleado" element={<AgregarEmpleado />} />
                  <Route path="/empleados" element={<Empleados />} />
                  <Route path="/vacaciones" element={<Vacations />} />
                  <Route path="/lines" element={<LinesPage />} />
                  <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
                </Routes>
              </div>
            </div>
          </Router>
        </LinesProvider>
      </VacationsProvider>
    </EmployeeProvider>
  );
}

export default App;
