import React from "react";
import IMAGES from "../images";
import "../styles/landing-page-styles.css";

function LogoSection() {
    return (
        <div id="logo-section">
            <img id="logo" src={IMAGES.LOGO} alt="Logo" />
            <h1 id="title">PageRhythm</h1>
        </div>
    );
}

function LoginSection() {
    return (
        <div id="login-section">
            <img src={IMAGES.LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER}   className="overlay-image" id = "login-section-top-right-corner-image" />
            <img src={IMAGES.LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER} className="overlay-image" id = "login-section-bottom-left-corner-image" />
        </div>
    )
}

export default function LandingPage() {
    return (
        <div id="landing-page">
            <LogoSection />
            <LoginSection />
        </div>
    );
}
