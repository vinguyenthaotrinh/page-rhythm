import React from "react";
import IMAGES from "../images"; // Ensure IMAGES.LOGO is imported correctly
import "../styles/landing-page-styles.css";

function LogoSection() {
    return (
        <div id="logo-section">
            <img id="logo" src={IMAGES.LOGO} alt="Logo" />
            <h1 id="title">PageRhythm</h1>
        </div>
    );
}

export default function LandingPage() {
    return (
        <div id="landing-page">
            <LogoSection />
        </div>
    );
}
