import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import "../styles/request-password-reset-page-styles.css";
import { Link, useNavigate, useParams } from "react-router-dom";

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

interface ResetPasswordSectionProps {
    token: string;
}

const ResetPasswordSection: React.FC<ResetPasswordSectionProps> = ({ token }) => {
    const [firstPassword, setFirstPassword]                         =   useState("");
    const [secondPassword, setSecondPassword]                       =   useState("");
    const [isFirstPasswordVisible, setIsFirstPasswordVisible]       =   useState(false);
    const [isSecondPasswordVisible, setIsSecondPasswordVisible]     =   useState(false);
    const [loadingLoginRequest, setLoadingLoginRequest]             =   useState(false);
    const [error, setError]                                         =   useState("");
    const navigate                                                  =   useNavigate();

    const toggleFirstPasswordVisibility = () => {
        setIsFirstPasswordVisible(previousState => !previousState);
    };

    const toggleSecondPasswordVisibility = () => {
        setIsSecondPasswordVisible(previousState => !previousState);
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoadingLoginRequest(true);
        setError("");

        try {
            setLoadingLoginRequest(true);
        
            const server    =   await Server.getInstance();
            
            const response  =   await server.resetPassword(token, firstPassword, secondPassword);

            if (response.status === 200) {
                navigate("/landing-page");
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
            setLoadingLoginRequest(false);
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
                    Reset Password
                </h1>
                <div 
                    id  =   "request-password-reset-page-welcome-description"
                > 
                    Please enter your new password and confirm it to reset your password.
                </div>
            </div>

            <br />

            <form 
                onSubmit    =   {handlePasswordReset}
            >
                <div 
                    className   =   "register-page-input-container"
                >
                    <img 
                        src         =   {IMAGES.LOCK_ICON} 
                        className   =   "register-page-input-icon" 
                    />
                    <input 
                        id          =   "register-page-first-password-input" 
                        type        =   {isFirstPasswordVisible ? "text" : "password"}
                        placeholder =   "Create password" 
                        className   =   "register-page-input-info" 
                        required
                        value       =   {firstPassword}
                        onChange    =   {(e) => setFirstPassword(e.target.value)}
                    />
                    <img 
                        src         =   {isFirstPasswordVisible ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}
                        className   =   "register-page-eye-icon" 
                        alt         =   "Eye Icon" 
                        onClick     =   {toggleFirstPasswordVisibility}
                    />
                </div>

                <div 
                    className       =   "register-page-input-container"
                >
                    <img 
                        src         =   {IMAGES.LOCK_ICON} 
                        className   =   "register-page-input-icon" 
                    />
                    <input 
                        id          =   "register-page-second-password-input" 
                        type        =   {isSecondPasswordVisible ? "text" : "password"}
                        placeholder =   "Confirm password" 
                        className   =   "register-page-input-info" 
                        required
                        value       =   {secondPassword}
                        onChange    =   {(e) => setSecondPassword(e.target.value)}
                    />
                    <img 
                        src         =   {isSecondPasswordVisible ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}    
                        className   =   "register-page-eye-icon" 
                        alt         =   "Eye Icon" 
                        onClick     =   {toggleSecondPasswordVisibility}    
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
                    disabled    =   {loadingLoginRequest}
                >
                    Reset Password
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

export default function ResetPasswordPage() {
    const {resetPasswordToken} = useParams<{ resetPasswordToken: string }>();
    const navigate = useNavigate();

    if (!resetPasswordToken) {
        navigate("/request-password-reset-page");
        return null;
    }

    return (
        <div 
            id  =   "landing-page"
        >
            <LogoSection />
            <div 
                id  =   "request-password-reset-page-authentication-sections"
            >
                <ResetPasswordSection 
                    token   =   {resetPasswordToken}
                />
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
