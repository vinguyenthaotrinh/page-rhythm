import "./App.css";
import React from "react";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import RegisterPage from "./components/RegisterPage";
import MyLibraryPage from "./components/MyLibraryPage";
import BookDetailsPage from "./components/BookDetailsPage";
import GeneralProfilePage from "./components/GeneralProfilePage";
import PasswordProfilePage from "./components/PasswordProfilePage";
import StatisticsProfilePage from "./components/StatisticsProfilePage";
import RequestPasswordResetPage from "./components/RequestPasswordResetPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/profile-page" element={<Navigate to="/profile-page/general" />} />
        <Route path="/profile-page/general" element={<GeneralProfilePage />} />
        <Route path="/profile-page/password" element={<PasswordProfilePage />} />
        <Route path="/profile-page/statistics" element={<StatisticsProfilePage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/my-library-page" element={<MyLibraryPage />} />
        <Route path="/book-details-page/:bookID" element={<BookDetailsPage />} />
        <Route path="/request-password-reset-page" element={<RequestPasswordResetPage />} />
        <Route path="/" element={<Navigate to="/landing-page" />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}