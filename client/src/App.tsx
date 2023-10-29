import React, { useState } from "react";

import { Routes, Route } from "react-router-dom";

import HomePage from "./components/feed/HomePage";
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";
import ProfilePage from "./components/Profilepage/ProfilePage";
import NotFound from "./components/NotFound";

import "./App.css";
import { ToastContainer } from "react-toastify";
import { getToken } from "./utils/localStorageUtils";

import ProtectedRoute from "./components/ProtectedRoute";
import LoggedInRestrictedRoute from "./components/LoggedInRestrictedRoute";

import UserContext from "./contexts/UserContext";

const App = () => {
  // TODO: Find a way to validate token
  // TODO: use userToken to restrict access for not logged in status
  const [userToken, setUserToken] = useState<string | null>(getToken());

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
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
        <Route
          path="/"
          element={
            <ProtectedRoute user={userToken}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <LoggedInRestrictedRoute user={userToken}>
              <Login />
            </LoggedInRestrictedRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <LoggedInRestrictedRoute user={userToken}>
              <SignUp />
            </LoggedInRestrictedRoute>
          }
        />
        <Route
          path="/home-page"
          element={
            <ProtectedRoute user={userToken}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-page"
          element={
            <ProtectedRoute user={userToken}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
