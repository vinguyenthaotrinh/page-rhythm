import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/register-page-styles.css";

function LogoSection() {
    return (
        <div id="logo-section">
            <img id="logo" src={IMAGES.LOGO} alt="Logo" />
            <h1 id="title">PageRhythm</h1>
        </div>
    );
}

function LoginSection() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loadingLoginRequest, setLoadingLoginRequest] = useState(false);
    const [error, setError] = useState("");

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
        
                // Save the session token or handle redirection
                // Example: Redirect or update app state
                // navigateToDashboard();
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

            <form onSubmit={handleLogin}>
                <div className="input-container">
                    <img src={IMAGES.USER_ICON} className="input-icon" />
                    <input 
                        type="email" 
                        placeholder="Enter Your Email"      
                        className="input-info" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  // Update email state
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}                       // Update password state
                    />
                    <img 
                        src={isPasswordVisible ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}  // Change icon based on visibility
                        id="eye-icon" 
                        alt="Eye Icon" 
                        onClick={togglePasswordVisibility}                                  // Call the toggle function on click
                    />
                </div>
                
                <button type="submit" id="login-button" disabled = {loadingLoginRequest}>Login</button>
            
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

function SignupSection() {
    return (
        <div id="signup-section">
            <h1 id="signup-title">New User?</h1>
            <Link to="/register-page" id="signup-button">Sign Up</Link>
        </div>
    );
}

export default function RegisterPage() {

    return (
        <div id="register-page">
            <LogoSection />
            <div id="authentication-sections">
                <LoginSection />
                <SignupSection />
            </div>

            <div className="front-left-image-container" id="left-corner-image">
                <img src={IMAGES.LANDING_PAGE_BOTTOM_LEFT_CORNER} className="left-overlay-image" alt="Left corner image" />
            </div>

            <div className="front-right-image-container" id="right-corner-image">
                <img src={IMAGES.LANDING_PAGE_BOTTOM_RIGHT_CORNER} className="right-overlay-image" alt="Right corner image"/>
            </div>

        </div>
    );
}
