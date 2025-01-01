import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import "../styles/register-terms-and-conditions-page-styles.css";
import { Link, useNavigate } from "react-router-dom";
import { Sign } from "crypto";

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

function TermsAndConditionsSection() {

    return (
        <div 
            id  =   "register-terms-and-conditions-main-section"
        >
            {/*
            <img 
                src         =   {IMAGES.LANDING_PAGE_LOGIN_SECTION_TOP_RIGHT_CORNER}   
                className   =   "register-page-overlay-image" 
                id          =   "register-page-signup-section-top-right-corner-image" 
            />
            <img 
                src         =   {IMAGES.LANDING_PAGE_LOGIN_SECTION_BOTTOM_LEFT_CORNER} 
                className   =   "register-page-overlay-image" 
                id          =   "register-page-signup-section-bottom-left-corner-image" 
            />
            */}
      
            <br /><br />
            
            <div
                id  =   "register-page-signup-title"
            >
                <h1     
                    id      =   "register-page-welcome-text"
                >
                    Welcome to PageRhythm
                </h1>
                <div    
                    id      =   "register-page-welcome-description"
                > 
                    Please read the terms and conditions before signing up
                </div>
            </div>

            <br />

            <div 
                id  =   "terms-and-conditions-content"
            >
                <ol>
                    <li>
                        <h2
                            className   =   "terms-and-conditions-section-title"
                        >
                            Account Creation and Management
                        </h2>
                        <ul>
                            <li>
                                Users must create an account to upload content, post comments, or access certain platform features.
                            </li>
                            <li>
                                Users are responsible for maintaining the confidentiality of their login credentials.
                            </li>
                            <li>
                            The platform reserves the right to suspend or terminate accounts for violations of terms or inactivity.
                            </li>
                            <li>
                                The platform reserves the right to remove any book that violates the terms of service or infringes on intellectual property rights.
                            </li>
                        </ul>
                    </li>

                    <li>
                        <h2 className="terms-and-conditions-section-title">
                            Privacy and Data Protection
                        </h2>
                        <ul>
                            <li>
                                The platform collects personal information such as name, email address, and other details necessary for account creation and usage. Users are responsible for providing accurate and up-to-date information.
                            </li>
                            <li>
                                Personal data collected by the platform will be used in accordance with applicable data protection laws and the platform's Privacy Policy, which is incorporated into these Terms and Conditions.
                            </li>
                            <li>
                                Users agree to allow the platform to process and store their data as required to maintain and improve the platform’s services. The platform will not sell or share personal data with third parties, except as required by law or as specified in the Privacy Policy.
                            </li>
                            <li>
                                The platform uses cookies and similar technologies to enhance user experience. By using the platform, users consent to the use of these technologies as described in the Privacy Policy.
                            </li>
                            <li>
                                Users have the right to access, update, or request the deletion of their personal data in accordance with applicable laws. Requests can be submitted through the platform's contact channels.
                            </li>
                        </ul>
                    </li>

                    <li>
                        <h2
                            className   =   "terms-and-conditions-section-title"
                        >
                            Books
                        </h2>
                        <ul>
                            <li>
                                Users are allowed to upload books only if they have the legal right to share them.
                            </li>
                            <li>
                                Uploaded books must be free of any copyrighted material unless the user has explicit permission to share it.
                            </li>
                            <li>
                                Users must ensure that the content of the uploaded books is appropriate.
                            </li>
                            <li>
                                The platform reserves the right to remove any book that violates the terms of service or infringes on intellectual property rights.
                            </li>
                            <li>
                                User accounts may be suspended or terminated if they repeatedly violate the platform's policies.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h2
                            className   =   "terms-and-conditions-section-title"
                        >
                            Comments
                        </h2>
                        <ul>
                            <li>
                                Users are encouraged to leave thoughtful and respectful comments related to the content on the platform.
                            </li>
                            <li>
                                Comments should not contain offensive language, hate speech, or discriminatory remarks.
                            </li>
                            <li>
                                Any comments that violate the platform’s code of conduct may be removed, and users may face temporary or permanent bans.
                            </li>
                            <li>
                                Users must not post comments that infringe on others’ intellectual property rights or include copyrighted material without permission.
                            </li>
                            <li>
                                The platform reserves the right to moderate and remove comments that violate these terms at its discretion.
                            </li>
                            <li>
                                By posting a comment, users grant the platform the right to use, modify, and display the comment as part of the content on the platform.
                            </li>
                        </ul>
                    </li>
                </ol>
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

export default function RegisterTermsAndConditionsPage() {

    return (
        <div 
            id  =   "register-terms-and-conditions-page"
        >
            <LogoSection />
            <div 
                id  =   "register-terms-and-conditions-page-sections"
            >
                <TermsAndConditionsSection />
                <LoginSection />
                <SignupSection />
            </div>

            <div 
                className       =   "register-page-front-left-image-container" 
                id              =   "register-page-left-corner-image"
            >
                <img 
                    src         =   {IMAGES.LANDING_PAGE_BOTTOM_LEFT_CORNER} 
                    className   =   "register-page-left-overlay-image" 
                    alt         =   "Left corner image" 
                />
            </div>

            <div 
                className       =   "register-page-front-right-image-container" 
                id              =   "register-page-right-corner-image"
            >
                <img 
                    src         =   {IMAGES.LANDING_PAGE_BOTTOM_RIGHT_CORNER} 
                    className   =   "register-terms-and-condition-page-right-overlay-image" 
                    alt         =   "Right corner image"
                />
            </div>

        </div>
    );
}
