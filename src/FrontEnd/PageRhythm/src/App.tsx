import "./App.css";
import React from "react";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import RegisterPage from "./components/RegisterPage";
import MyLibraryPage from "./components/MyLibraryPage";
import BookDetailsPage from "./components/BookDetailsPage";
import RequestPasswordResetPage from "./components/RequestPasswordResetPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/my-library-page" element={<MyLibraryPage />} />
        <Route path="/book-details-page" element={<BookDetailsPage />} />
        <Route path="/request-password-reset-page" element={<RequestPasswordResetPage />} />
        <Route path="/" element={<Navigate to="/landing-page" />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}