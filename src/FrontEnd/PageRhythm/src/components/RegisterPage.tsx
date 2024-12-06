import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from 'react';
import "../styles/register-page-styles.css";
import { Link, useNavigate } from 'react-router-dom';

function LogoSection() {
    return (
        <div id="register-page-logo-section">
            <img id="register-page-logo" src={IMAGES.LOGO} alt="Logo" />
            <h1 id="register-page-title">PageRhythm</h1>
        </div>
    );
}

function SignupSection() {
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loadingSignupRequest, setLoadingSignupRequest] = useState(false);
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();                 // Prevent form default submission behavior

        setLoadingSignupRequest(true);       // Set loading state to true
        setError("");                       // Clear any previous error

        const navigate = useNavigate();

        try {
            setLoadingSignupRequest(true);   // Start loading
        
            const server = await Server.getInstance();
            const response = await server.login(email, password); // Use the login method from the Server class
        
            if (response.ok) {
                console.log('Login successful');

                navigate('/home-page');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed');  // Handle server errors (e.g., invalid credentials)
            }
        } catch (err) {
            setError('An error occurred. Please try again.');   // Handle network or other errors
            console.error('Login error:', err);
        } finally {
            setLoadingSignupRequest(false);                      // Stop loading when the request is done
        }
    };

    return (
        <div id="register-page-signup-section">
            <img 
                src={IMAGES.LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER}   
                className="register-page-overlay-image" 
                id="register-page-signup-section-top-right-corner-image" 
            />
            <img 
                src={IMAGES.LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER} 
                className="register-page-overlay-image" 
                id="register-page-signup-section-bottom-left-corner-image" 
            />
      
            <br /><br />
            
            <div id="register-page-signup-title">
                <h1 id="register-page-welcome-text">Welcome to PageRhythm</h1>
                <div id="register-page-welcome-description"> Sign up to continue </div>
            </div>

            <br />

            <form onSubmit={handleSignup}>
                <div className="register-page-input-container">
                    <img src={IMAGES.USER_ICON} className="register-page-input-icon" />
                    <input 
                        type="email" 
                        placeholder="Enter Your Email"      
                        className="register-page-input-info" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  // Update email state
                    />
                </div>

                <div className="register-page-input-container">
                    <img src={IMAGES.LOCK_ICON} className="register-page-input-icon" />
                    <input 
                        id="register-page-password-input" 
                        type={isPasswordVisible ? "text" : "password"}  // Toggle password visibility
                        placeholder="Enter Your Password" 
                        className="register-page-input-info" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}                       // Update password state
                    />
                    <img 
                        src={isPasswordVisible ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}  // Change icon based on visibility
                        id="register-page-eye-icon" 
                        alt="Eye Icon" 
                        onClick={togglePasswordVisibility}                                  // Call the toggle function on click
                    />
                </div>
                
                <button type="submit" id="register-page-signup-button" disabled = {loadingSignupRequest}>Sign up</button>

            </form>
        </div>
    );
}

function LoginSection() {
    return (
        <div id="register-page-login-section">
            <h1 id="register-page-login-title">Have an account?</h1>
            <Link to="/landing-page" id="register-page-login-button">Login</Link>
        </div>
    );
}

export default function RegisterPage() {

    return (
        <div id="register-page">
            <LogoSection />
            <div id="register-page-authentication-sections">
                <SignupSection />
                <LoginSection />
            </div>

            <div className="register-page-front-left-image-container" id="register-page-left-corner-image">
                <img src={IMAGES.LANDING_PAGE_BOTTOM_LEFT_CORNER} className="register-page-left-overlay-image" alt="Left corner image" />
            </div>

            <div className="register-page-front-right-image-container" id="register-page-right-corner-image">
                <img src={IMAGES.LANDING_PAGE_BOTTOM_RIGHT_CORNER} className="register-page-right-overlay-image" alt="Right corner image"/>
            </div>

        </div>
    );
}
