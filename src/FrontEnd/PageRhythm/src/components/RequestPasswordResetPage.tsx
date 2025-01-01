import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/request-password-reset-page-styles.css";

function LogoSection() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/landing-page");
    };

    return (
        <div 
            id          =   "request-password-reset-page-logo-section"
            role        =   "button"
            tabIndex    =   {0}
            onClick     =   {handleLogoClick}
            onKeyDown   =   {(e) => e.key === "Enter" && handleLogoClick()}
            style       =   {{ cursor: "pointer" }}
        >
            <img 
                id  =   "request-password-reset-page-logo" 
                src =   {IMAGES.LOGO} 
                alt =   "Logo" 
            />
            <h1 
                id  =   "request-password-reset-page-title"
            >
                PageRhythm
            </h1>
        </div>
    );
}

function RequestPasswordResetSection() {
    const [email, setEmail]                                             =   useState("");
    const [loadingPasswordResetRequest, setLoadingPasswordResetRequest] =   useState(false);
    const [error, setError]                                             =   useState("");
    const navigate                                                      =   useNavigate();

    const handlePasswordResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoadingPasswordResetRequest(true);
        setError("");

        try {
            setLoadingPasswordResetRequest(true);
        
            const server    =   await Server.getInstance();
            
            const response  =   await server.requestPasswordReset(email);

            if (response.status === 200) {
                navigate("/successfully-password-reset-email-page");
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } catch (e) {
            if (e instanceof Error)
                setError(e.message);
            else {
                setError("An unexpected error occurred. Please try again later.");
                console.error(e);
            }
        } finally {
            setLoadingPasswordResetRequest(false);
        }
    };

    return (
        <div 
            id  =   "request-password-reset-page-main-section"
        >
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
                onSubmit    =   {handlePasswordResetRequest}
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
                        onChange    =   {(e) => setEmail(e.target.value)}
                    />
                </div>

                {error && 
                    <div 
                        id  =   "request-password-reset-page-error-message"
                    >
                        {error}
                    </div>
                }
                
                <button 
                    type        =   "submit" 
                    id          =   "request-password-reset-page-submit-button" 
                    disabled    =   {loadingPasswordResetRequest}
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
            Back to
            <Link 
                to  =   "/landing-page" 
                id  =   "request-password-reset-page-login-link"
            >
                Login
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
