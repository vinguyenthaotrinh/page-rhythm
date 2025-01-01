import IMAGES from "../images";
import Server from "../Server";
import "../styles/page-not-found-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function LogoSection() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/landing-page");
    };

    return (
        <div 
            id          =   "register-page-logo-section"
            role        =   "button"
            tabIndex    =   {0}
            onClick     =   {handleLogoClick}
            onKeyDown   =   {(e) => e.key === "Enter" && handleLogoClick()}
            style       =   {{ cursor: "pointer" }}
        >
            <img 
                id      =   "register-page-logo" 
                src     =   {IMAGES.LOGO} 
                alt     =   "Logo" 
            />
            <h1 
                id  =   "register-page-title"
            >
                PageRhythm
            </h1>
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

export default function SuccessfullyPasswordResetEmailPage() {
    return (
        <div 
            className   =   "page-not-found"
        >
            <LogoSection />
            <div 
                className   =   "page-not-found-content"
            >
                <h1>
                    Reset Password
                </h1>
                <p>
                    An email has been sent to your email address with instructions on how to reset your password.
                </p>
            </div>
            <LoginSection />
            <SignupSection />
        </div>
    )
}