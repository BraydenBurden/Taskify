import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import MainContent from "./components/MainContent";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = ({ mode, toggleColorMode }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage mode={mode} toggleColorMode={toggleColorMode} />}
      />
      <Route
        path="/login"
        element={<Login mode={mode} toggleColorMode={toggleColorMode} />}
      />
      <Route
        path="/signup"
        element={<SignUp mode={mode} toggleColorMode={toggleColorMode} />}
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <MainContent mode={mode} toggleColorMode={toggleColorMode} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
