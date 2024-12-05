import IMAGES from "../images";
import React, { useState } from 'react';
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
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    };

    return (
        <div id="login-section">
            <img 
                src={IMAGES.LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER}   
                className="overlay-image" 
                id="login-section-top-right-corner-image" 
            />
            <img 
                src={IMAGES.LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER} 
                className="overlay-image" 
                id="login-section-bottom-left-corner-image" 
            />
      
            <br /><br />
            
            <div id="login-title">
                <h1 id="welcome-text">Welcome Back</h1>
                <div id="welcome-description"> Login to continue </div>
            </div>

            <br />

            <form>
                <div className="input-container">
                    <img src={IMAGES.USER_ICON} className="input-icon" />
                    <input 
                        type="email" 
                        placeholder="Enter Your Email"      
                        className="input-info" 
                        required 
                    />
                </div>

                <div className="input-container">
                    <img src={IMAGES.LOCK_ICON} className="input-icon" />
                    <input 
                        id="password-input" 
                        type={isPasswordVisible ? "text" : "password"}  // Toggle password visibility
                        placeholder="Enter Your Password" 
                        className="input-info" 
                        required 
                    />
                    <img 
                        src={isPasswordVisible ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}  // Change icon based on visibility
                        id="eye-icon" 
                        alt="Eye Icon" 
                        onClick={togglePasswordVisibility}  // Call the toggle function on click
                    />
                </div>
                
                <button type="submit" id="login-button">Login</button>
            
                <div id="google-login">
                    <p>Login with</p>
                    <a href="#">
                        <img src={IMAGES.GOOGLE_ICON} />
                    </a>
                </div>

            </form>
        </div>
    );
}

export default function LandingPage() {

    return (
        <div id="landing-page">
            <LogoSection />
            <LoginSection />

            <div className="front-left-image-container" id="left-corner-image">
                <img src={IMAGES.LANDING_PAGE_BOTTOM_LEFT_CORNER} className="left-overlay-image" />
            </div>

        </div>
    );
}
