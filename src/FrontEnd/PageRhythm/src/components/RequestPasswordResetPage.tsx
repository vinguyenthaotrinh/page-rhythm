import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/request-password-reset-page-styles.css";

function LogoSection() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/landing-page');
    };

    return (
        <div 
            id="request-password-reset-page-logo-section"
            role="button"
            tabIndex={0}
            onClick={handleLogoClick}
            onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
            style={{ cursor: 'pointer' }}
        >
            <img id="request-password-reset-page-logo" src={IMAGES.LOGO} alt="Logo" />
            <h1 id="request-password-reset-page-title">PageRhythm</h1>
        </div>
    );
}

function RequestPasswordResetSection() {
    const [email, setEmail]                             = useState("");
    const [loadingLoginRequest, setLoadingLoginRequest] = useState(false);
    const [error, setError]                             = useState("");
    const navigate                                      = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();                 // Prevent form default submission behavior

        setLoadingLoginRequest(true);       // Set loading state to true
        setError("");                       // Clear any previous error

        try {
            setLoadingLoginRequest(true);
        
            const server = await Server.getInstance();
            //TO BE CONTINUED
        } catch (err) {
            setError('An error occurred. Please try again.'); // Handle network or other errors
            console.error('Login error:', err);
        } finally {
            setLoadingLoginRequest(false); // Stop loading when the request is done
        }
    };

    return (
        <div id="request-password-reset-page-main-section">
            <img 
                src         =   {IMAGES.LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER}   
                className   =   "request-password-reset-page-overlay-image" 
                id          =   "request-password-reset-page-login-section-top-right-corner-image" 
            />
            <img 
                src         =   {IMAGES.LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER} 
                className   =   "request-password-reset-page-overlay-image" 
                id          =   "request-password-reset-page-login-section-bottom-left-corner-image" 
            />
      
            <br /><br />
            
            <div 
                id  =   "request-password-reset-page-login-title"
            >
                <h1 
                    id  =   "request-password-reset-page-welcome-text"
                >
                    Forgot Your Password?
                </h1>
                <div 
                    id  =   "request-password-reset-page-welcome-description"
                > 
                    Don't worry 
                </div>
            </div>

            <br />

            <form 
                onSubmit    =   {handleLogin}
            >
                <div 
                    className   =   "request-password-reset-page-input-container"
                >
                    <img 
                        src         =   {IMAGES.MAIL_ICON} 
                        className   =   "request-password-reset-page-input-icon" 
                    />
                    <input 
                        type        =   "email" 
                        placeholder =   "Enter your registered email"      
                        className   =   "request-password-reset-page-input-info" 
                        required
                        value       =   {email}
                        onChange    =   {(e) => setEmail(e.target.value)}  // Update email state
                    />
                </div>
                
                <button 
                    type        =   "submit" 
                    id          =   "request-password-reset-page-submit-button" 
                    disabled    =   {loadingLoginRequest}
                >
                    Send password reset email
                </button>

            </form>
        </div>
    );
}

function LoginSection() {
    return (
        <div 
            id  =   "request-password-reset-page-login-section">
            <Link 
                to  =   "/landing-page" 
                id  =   "request-password-reset-page-login-link"
            >
                Back to Login
            </Link>
        </div>
    );
}

export default function RequestPasswordResetPage() {

    return (
        <div 
            id  =   "landing-page"
        >
            <LogoSection />
            <div 
                id  =   "request-password-reset-page-authentication-sections"
            >
                <RequestPasswordResetSection />
                <LoginSection />
            </div>

            <div 
                className       =   "request-password-reset-page-front-left-image-container" 
                id              =   "request-password-reset-page-left-corner-image"
            >
                <img 
                    src         =   {IMAGES.LANDING_PAGE_BOTTOM_LEFT_CORNER} 
                    className   =   "request-password-reset-page-left-overlay-image" 
                    alt         =   "Left corner image" 
                />
            </div>

            <div 
                className       =   "request-password-reset-page-front-right-image-container" 
                id              =   "request-password-reset-page-right-corner-image"
            >
                <img 
                    src         =   {IMAGES.LANDING_PAGE_BOTTOM_RIGHT_CORNER} 
                    className   =   "request-password-reset-page-right-overlay-image" 
                    alt         =   "Right corner image"
                />
            </div>

        </div>
    );
}
