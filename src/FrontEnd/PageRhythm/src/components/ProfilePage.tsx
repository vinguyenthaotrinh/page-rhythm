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

    return (
        <div className="profile-section-bar">
            <button 
                className="profile-section-button" 
                onClick={() => handleSectionClick("/profile-page")}
            >
                General
            </button>
            <button 
                className="profile-section-button" 
                onClick={() => handleSectionClick("/profile-page/password")}
            >
                Password
            </button>
            <button 
                className="profile-section-button" 
                onClick={() => handleSectionClick("/profile-page/statistics")}
            >
                Statistics
            </button>
            <button 
                className="profile-section-button logout-button" 
                onClick={() => handleSectionClick("/logout")}
            >
                Logout
            </button>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <div>
            <NavigationBar />
            <ProfileSectionBar />
        </div>
    )
}