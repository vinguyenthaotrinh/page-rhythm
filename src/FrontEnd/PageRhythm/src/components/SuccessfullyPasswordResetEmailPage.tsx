import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/successfully-password-reset-email-page-styles.css";

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

function AnnoucementSection() {
    const [email, setEmail]                             =   useState("");
    const [loadingLoginRequest, setLoadingLoginRequest] =   useState(false);
    const [error, setError]                             =   useState("");
    const navigate                                      =   useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();                 // Prevent form default submission behavior

        setLoadingLoginRequest(true);
        setError("");

        try {
            setLoadingLoginRequest(true);
        
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
                id  =   "successfully-password-reset-email-page-anouncement-content-container"
            >
                <h1 
                    id  =   "request-password-reset-page-welcome-text"
                >
                    Password Reset Email Sent
                </h1>
                <div 
                    id  =   "request-password-reset-page-welcome-description"
                > 
                    An email has been sent to your email address. Please check your email to reset your password.
                </div>
            </div>
        </div>
    );
}

function LoginSection() {
    return (
        <div 
            id  =   "register-page-login-section"
        >
            <h1 
                id  =   "register-page-login-title"
            >
                Have an account?
            </h1>
            <Link 
                to  =   "/landing-page" 
                id  =   "register-page-login-link"
            >
                Login
            </Link>
        </div>
    );
}

function SignupSection() {
    return (
        <div
            id  =   "landing-page-signup-section"
        >
            <h1 
                id  =   "landing-page-signup-title"
            >
                New User?
            </h1>
            <Link 
                to  =   "/register-page" 
                id  =   "landing-page-signup-link"
            >
                Sign Up
            </Link>
        </div>
    );
}

export default function SuccessfullyPasswordResetMailPage() {

    return (
        <div 
            id  =   "landing-page"
        >
            <LogoSection />
            <div 
                id  =   "request-password-reset-page-authentication-sections"
            >
                <AnnoucementSection />
                <LoginSection />
                <SignupSection />
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
