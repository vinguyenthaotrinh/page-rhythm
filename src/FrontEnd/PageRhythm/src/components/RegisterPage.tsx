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
    const [firstPassword, setFirstPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [isFirstPasswordVisible, setIsFirstPasswordVisible] = useState(false);
    const [isSecondPasswordVisible, setIsSecondPasswordVisible] = useState(false);
    const [loadingSignupRequest, setLoadingSignupRequest] = useState(false);
    const [error, setError] = useState("");
    const [agreeWithTerms, setAgreeWithTerms] = useState(false);

    const toggleFirstPasswordVisibility = () => {
        setIsFirstPasswordVisible(previousState => !previousState);
    };

    const toggleSecondPasswordVisibility = () => {
        setIsSecondPasswordVisible(previousState => !previousState);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();                 // Prevent form default submission behavior

        setLoadingSignupRequest(true);       // Set loading state to true
        setError("");                       // Clear any previous error

        if (firstPassword !== secondPassword) {
            setError("Passwords do not match");
            return;
        }

        const navigate = useNavigate();

        try {
            setLoadingSignupRequest(true);   // Start loading
        
            const server = await Server.getInstance();

            const response = await server.signup(fullName, email, firstPassword, dateOfBirth, bio);

            if (response.ok) {
                console.log('Signup successful');
        
                navigate('/home-page');
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Signup failed"); // Handle server errors (e.g., invalid credentials)
            }
        } catch (err) {
            setError('An error occurred. Please try again.');   // Handle network or other errors
            console.error('Signup error:', err);
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
                        type="text" 
                        placeholder="Enter your full name"      
                        className="register-page-input-info" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}  // Update full name state
                    />
                </div>
                
                <div className="register-page-input-container">
                    <img src={IMAGES.MAIL_ICON} className="register-page-input-icon" />
                    <input 
                        type="email" 
                        placeholder="Enter your email"      
                        className="register-page-input-info" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  // Update email state
                    />
                </div>

                <div className="register-page-input-container">
                    <img src={IMAGES.LOCK_ICON} className="register-page-input-icon" />
                    <input 
                        id="register-page-first-password-input" 
                        type={isFirstPasswordVisible ? "text" : "password"}  // Toggle password visibility
                        placeholder="Create password" 
                        className="register-page-input-info" 
                        required
                        value={firstPassword}
                        onChange={(e) => setFirstPassword(e.target.value)}                       // Update password state
                    />
                    <img 
                        src={isFirstPasswordVisible ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}  // Change icon based on visibility
                        className="register-page-eye-icon" 
                        alt="Eye Icon" 
                        onClick={toggleFirstPasswordVisibility}                                  // Call the toggle function on click
                    />
                </div>

                <div className="register-page-input-container">
                    <img src={IMAGES.LOCK_ICON} className="register-page-input-icon" />
                    <input 
                        id="register-page-second-password-input" 
                        type={isFirstPasswordVisible ? "text" : "password"}  // Toggle password visibility
                        placeholder="Confirm password" 
                        className="register-page-input-info" 
                        required
                        value={secondPassword}
                        onChange={(e) => setSecondPassword(e.target.value)}                       // Update password state
                    />
                    <img 
                        src={isSecondPasswordVisible ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}  // Change icon based on visibility
                        className="register-page-eye-icon" 
                        alt="Eye Icon" 
                        onClick={toggleSecondPasswordVisibility}                                  // Call the toggle function on click
                    />
                </div>

                <div className="register-page-input-container">
                    <img src={IMAGES.CALENDAR_ICON} className="register-page-input-icon" />
                    <input 
                        type="date" 
                        placeholder="Enter your date of birth (mm/dd/yyyy)"      
                        className="register-page-input-info" 
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}  // Update date of birth state
                    />
                </div>

                <div className="register-page-input-container">
                    <img src={IMAGES.PENCIL_ICON} id="register-page-pencil-icon" />
                    <textarea
                        placeholder="Write your bio here"    
                        className="register-page-input-info" 
                        required
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}  // Update bio state
                        rows = {8}
                    />
                </div>

                <div 
                    className="register-page-input-container"
                    id = "register-page-terms-container"
                >
                    <label htmlFor="agree-terms" className="terms-label">
                        <input 
                            type="checkbox" 
                            id="agree-terms"
                            name="agree-terms" 
                            required 
                            checked={agreeWithTerms} 
                            onChange={(e) => setAgreeWithTerms(e.target.checked)} // Update agree state
                        />
                        I agree with the <a href="/terms-and-conditions" target="_blank">Terms and Conditions</a>
                    </label>
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
