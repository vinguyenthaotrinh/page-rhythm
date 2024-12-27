import "../styles/admin-section-bar-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface AdminSectionBarProps {
    currentOption: string;
}

export default function AdminSectionBar({ currentOption }: AdminSectionBarProps) {
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const navigate                          = useNavigate();

    const handleSectionClick = (path: string) => {
        navigate(path);
    };

    const getButtonClass = (option: string) => {
        if (hoveredOption === option) 
            return "hover-effect";
        if (!hoveredOption && currentOption === option) 
            return "hover-effect";
        return "";
    };

    return (
        <div 
            className   =   "admin-page-admin-section-bar"
        >
            <button 
                className       =   {`admin-page-admin-section-button ${getButtonClass("books")}`} 
                onClick         =   {() => handleSectionClick("/admin-page/books")}
                onMouseEnter    =   {() => setHoveredOption("books")}
                onMouseLeave    =   {() => setHoveredOption(null)}
            >
                Books
            </button>
            <button 
                className       =   {`admin-page-admin-section-button ${getButtonClass("accounts")}`} 
                onClick         =   {() => handleSectionClick("/admin-page/accounts")}
                onMouseEnter    =   {() => setHoveredOption("accounts")}
                onMouseLeave    =   {() => setHoveredOption(null)}
            >
                Accounts
            </button>
        </div>
    );
}