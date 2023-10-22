import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import Login from "./components/authentication/Login";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/home-page" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
