// src/contexts/VacationsContext.js
import React, { createContext, useState, useEffect } from "react";
import { EmployeeContext } from "../contexts/EmployeeContext";
import { LinesContext } from "../contexts/LinesContext";

export const VacationsContext = createContext();

export const VacationsProvider = ({ children }) => {
  const [vacations, setVacations] = useState([]);

  useEffect(() => {
    const savedVacations = localStorage.getItem("vacations");
    if (savedVacations) {
      setVacations(JSON.parse(savedVacations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vacations", JSON.stringify(vacations));
  }, [vacations]);

  return (
    <VacationsContext.Provider value={{ vacations, setVacations }}>
      {children}
    </VacationsContext.Provider>
  );
};
