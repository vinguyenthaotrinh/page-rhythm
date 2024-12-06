import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import "../styles/landing-page-styles.css";
import { Link, useNavigate } from 'react-router-dom';

function LogoSection() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/landing-page');
    };

    return (
        <div 
            id="register-page-logo-section"
            role="button"
            tabIndex={0}
            onClick={handleLogoClick}
            onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
            style={{ cursor: 'pointer' }}
        >
            <img id="register-page-logo" src={IMAGES.LOGO} alt="Logo" />
            <h1 id="register-page-title">PageRhythm</h1>
        </div>
    );
}

function LoginSection() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loadingLoginRequest, setLoadingLoginRequest] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();                 // Prevent form default submission behavior

        setLoadingLoginRequest(true);       // Set loading state to true
        setError("");                       // Clear any previous error

        try {
            setLoadingLoginRequest(true);   // Start loading
        
            const server = await Server.getInstance();
            const response = await server.login(email, password); // Use the login method from the Server class
        
            if (response.ok) {
                console.log('Login successful');
        
                navigate('/home-page');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed'); // Handle server errors (e.g., invalid credentials)
            }
        } catch (err) {
            setError('An error occurred. Please try again.'); // Handle network or other errors
            console.error('Login error:', err);
        } finally {
            setLoadingLoginRequest(false); // Stop loading when the request is done
        }
    };

    return (
        <div id="landing-page-login-section">
            <img 
                src={IMAGES.LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER}   
                className="landing-page-overlay-image" 
                id="landing-page-login-section-top-right-corner-image" 
            />
            <img 
                src={IMAGES.LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER} 
                className="landing-page-overlay-image" 
                id="landing-page-login-section-bottom-left-corner-image" 
            />
      
            <br /><br />
            
            <div id="landing-page-login-title">
                <h1 id="landing-page-welcome-text">Welcome Back</h1>
                <div id="landing-page-welcome-description"> Login to continue </div>
            </div>

            <br />

            <form onSubmit={handleLogin}>
                <div className="landing-page-input-container">
                    <img src={IMAGES.MAIL_ICON} className="landing-page-input-icon" />
                    <input 
                        type="email" 
                        placeholder="Enter your email"      
                        className="landing-page-input-info" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  // Update email state
                    />
                </div>

                <div className="landing-page-input-container">
                    <img src={IMAGES.LOCK_ICON} className="landing-page-input-icon" />
                    <input 
                        id="password-input" 
                        type={isPasswordVisible ? "text" : "password"}  // Toggle password visibility
                        placeholder="Enter your password" 
                        className="landing-page-input-info" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}                       // Update password state
                    />
                    <img 
                        src={isPasswordVisible ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}  // Change icon based on visibility
                        id="landing-page-eye-icon" 
                        alt="Eye Icon" 
                        onClick={togglePasswordVisibility}                                  // Call the toggle function on click
                    />
                </div>
                
                <button type="submit" id="landing-page-login-button" disabled = {loadingLoginRequest}>Login</button>

                <div id = "landing-page-request-password-reset-link-container">
                    <Link to="/request-password-reset-page" id="landing-page-forgot-password-link">Forgot Password?</Link>
                </div>
            
                {
                /*
                <div id="landing-page-google-login">
                    <p>Login with</p>
                    <a href="#">
                        <img src={IMAGES.GOOGLE_ICON} />
                    </a>
                </div>
                */
                }

            </form>
        </div>
    );
}

function SignupSection() {
    return (
        <div id="landing-page-signup-section">
            <h1 id="landing-page-signup-title">New User?</h1>
            <Link to="/register-page" id="landing-page-signup-link">Sign Up</Link>
        </div>
    );
}

export default function LandingPage() {

    return (
        <div id="landing-page">
            <LogoSection />
            <div id="landing-page-authentication-sections">
                <LoginSection />
                <SignupSection />
            </div>

            <div className="landing-page-front-left-image-container" id="landing-page-left-corner-image">
                <img src={IMAGES.LANDING_PAGE_BOTTOM_LEFT_CORNER} className="landing-page-left-overlay-image" alt="Left corner image" />
            </div>

            <div className="landing-page-front-right-image-container" id="landing-page-right-corner-image">
                <img src={IMAGES.LANDING_PAGE_BOTTOM_RIGHT_CORNER} className="landing-page-right-overlay-image" alt="Right corner image"/>
            </div>

        </div>
    );
}
