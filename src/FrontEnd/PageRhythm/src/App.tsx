import "./App.css";
import React from "react";
import LandingPage from "./components/LandingPage";
import RegisterPage from "./components/RegisterPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/landing-page" />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}