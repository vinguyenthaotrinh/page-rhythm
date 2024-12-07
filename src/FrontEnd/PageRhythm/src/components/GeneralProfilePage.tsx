import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/general-profile-page-styles.css";
import { Link, useNavigate } from 'react-router-dom';

function ProfileSectionBar() {
    const navigate = useNavigate();

    const handleSectionClick = (path: string) => {
        navigate(path);
    };

    const handleLogout = async () => {
        const server = await Server.getInstance();
        await server.logout();
        navigate("/landing-page");
    };

    return (
        <div className="general-profile-page-profile-section-bar">
            <button 
                className="general-profile-page-profile-section-button" 
                onClick={() => handleSectionClick("/profile-page/general")}
            >
                General
            </button>
            <button 
                className="general-profile-page-profile-section-button" 
                onClick={() => handleSectionClick("/profile-page/password")}
            >
                Password
            </button>
            <button 
                className="general-profile-page-profile-section-button" 
                onClick={() => handleSectionClick("/profile-page/statistics")}
            >
                Statistics
            </button>
            <button 
                className="general-profile-page-profile-section-button logout-button" 
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

export default function GeneralProfilePage() {
    return (
        <div className="general-profile-page">
            <NavigationBar />
            <div className="general-profile-page-container">
                <ProfileSectionBar />
                <div className="general-profile-page-profile-content">
                    <h1 id = "general-profile-page-title">General Information</h1>
                    <p>This is where your profile content will be displayed depending on the section.</p>
                </div>
            </div>
        </div>
    );
}
