import "./App.css";
import HomePage from "./components/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home-page" element={<HomePage />} />{" "}
        {/* 👈 Renders at /app/ */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
