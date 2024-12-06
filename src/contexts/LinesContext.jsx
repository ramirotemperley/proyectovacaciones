// src/contexts/LinesContext.js
import React, { createContext, useState, useEffect } from "react";

export const LinesContext = createContext();

export const LinesProvider = ({ children }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const savedLines = localStorage.getItem("lines");
    if (savedLines) {
      setLines(JSON.parse(savedLines));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lines", JSON.stringify(lines));
  }, [lines]);

  return (
    <LinesContext.Provider value={{ lines, setLines }}>
      {children}
    </LinesContext.Provider>
  );
};
