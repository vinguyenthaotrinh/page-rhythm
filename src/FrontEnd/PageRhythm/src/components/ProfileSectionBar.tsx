import IMAGES from "../images";
import Server from "../Server";
import "../styles/profile-section-bar.css";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ProfileSectionBarProps {
    currentOption: string;
}

export default function ProfileSectionBar({ currentOption }: ProfileSectionBarProps) {
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSectionClick = (path: string) => {
        navigate(path);
    };

    const handleLogout = async () => {
        const server = await Server.getInstance();
        await server.logout();
        navigate("/landing-page");
    };

    // Determine if the current option should have hover effect
    const getButtonClass = (option: string) => {
        // If hoveredOption is set to this option, apply hover effect
        if (hoveredOption === option) {
            return "hover-effect";
        }
        // If no option is hovered, apply hover effect to the current option
        if (!hoveredOption && currentOption === option) {
            return "hover-effect";
        }
        return "";
    };

    return (
        <div className="profile-page-profile-section-bar">
            <button 
                className={`profile-page-profile-section-button ${getButtonClass("general")}`} 
                onClick={() => handleSectionClick("/profile-page/general")}
                onMouseEnter={() => setHoveredOption("general")}
                onMouseLeave={() => setHoveredOption(null)}
            >
                General
            </button>
            <button 
                className={`profile-page-profile-section-button ${getButtonClass("password")}`} 
                onClick={() => handleSectionClick("/profile-page/password")}
                onMouseEnter={() => setHoveredOption("password")}
                onMouseLeave={() => setHoveredOption(null)}
            >
                Password
            </button>
            <button 
                className={`profile-page-profile-section-button ${getButtonClass("statistics")}`} 
                onClick={() => handleSectionClick("/profile-page/statistics",)}
                onMouseEnter={() => setHoveredOption("statistics")}
                onMouseLeave={() => setHoveredOption(null)}
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