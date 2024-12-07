import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import "../styles/profile-section-bar.css";
import NavigationBar from "./NavigationBar";
import { Link, useNavigate } from 'react-router-dom';

export default function ProfileSectionBar() {
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
        <div className="profile-page-profile-section-bar">
            <button 
                className="profile-page-profile-section-button" 
                onClick={() => handleSectionClick("/profile-page/general")}
            >
                General
            </button>
            <button 
                className="profile-page-profile-section-button" 
                onClick={() => handleSectionClick("/profile-page/password")}
            >
                Password
            </button>
            <button 
                className="profile-page-profile-section-button" 
                onClick={() => handleSectionClick("/profile-page/statistics")}
            >
                Statistics
            </button>
            <button 
                className="profile-page-profile-section-button logout-button" 
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}