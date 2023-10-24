import React from "react";

import { Routes, Route } from "react-router-dom";

import HomePage from "./components/feed/HomePage";
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";

import "./App.css";
import ProfilePage from "./components/Profilepage/ProfilePage";
import { ToastContainer } from "react-toastify";
import { getToken } from "./utils/localStorageUtils";

const App = () => {
  // TODO: Find a way to validate token
  // TODO: use userToken to restrict access for not logged in status
  const userToken = getToken();

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile-page" element={<ProfilePage />} />
      </Routes>
    </>
  );
};

export default App;
