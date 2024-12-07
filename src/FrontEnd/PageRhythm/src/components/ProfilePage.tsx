import IMAGES from "../images";
import Server from "../Server";
import "../styles/profile-page-styles.css";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
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
        <div className="profile-section-bar">
            <button 
                className="profile-section-button" 
                onClick={() => handleSectionClick("/profile/general")}
            >
                General
            </button>
            <button 
                className="profile-section-button" 
                onClick={() => handleSectionClick("/profile/password")}
            >
                Password
            </button>
            <button 
                className="profile-section-button" 
                onClick={() => handleSectionClick("/profile/statistics")}
            >
                Statistics
            </button>
            <button 
                className="profile-section-button logout-button" 
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <div className="profile-page">
            <NavigationBar />
            <div className="profile-page-container">
                <ProfileSectionBar />
                <div className="profile-content">
                    {/* Content for the selected section goes here */}
                </div>
            </div>
        </div>
    );
}