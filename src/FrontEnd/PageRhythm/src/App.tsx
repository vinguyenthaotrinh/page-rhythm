import "./App.css";
import React from "react";
import LandingPage from "./components/LandingPage";
import RegisterPage from "./components/RegisterPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/landing_page" element={<LandingPage />} />
        <Route path="/register_page" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/landing_page" />} />
      </Routes>
    </Router>
  )
}
