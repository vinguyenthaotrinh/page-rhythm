import React from 'react';
import './App.css';
import LandingPage from './components/LandingPage'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <LandingPage />
          </div>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
