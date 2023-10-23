import React from "react";

import { Routes, Route } from "react-router-dom";

import HomePage from "./components/feed/HomePage";
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/home-page" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
};

export default App;
