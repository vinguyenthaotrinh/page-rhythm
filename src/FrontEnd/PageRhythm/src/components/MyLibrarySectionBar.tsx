import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/my-library-section-bar-styles.css";
import { Link, useNavigate } from "react-router-dom";

interface MyLibrarySectionBarProps {
    currentOption: string;
}

export default function MyLibrarySectionBar({ currentOption }: MyLibrarySectionBarProps) {
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSectionClick = (path: string) => {
        navigate(path);
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
        <div className="my-library-page-my-library-section-bar">
            <button 
                className={`my-library-page-my-library-section-button ${getButtonClass("books")}`} 
                onClick={() => handleSectionClick("/my-library-page/books")}
                onMouseEnter={() => setHoveredOption("books")}
                onMouseLeave={() => setHoveredOption(null)}
            >
                Books
            </button>
            <button 
                className={`my-library-page-my-library-section-button ${getButtonClass("voices")}`} 
                onClick={() => handleSectionClick("/my-library-page/voices")}
                onMouseEnter={() => setHoveredOption("voices")}
                onMouseLeave={() => setHoveredOption(null)}
            >
                Voices
            </button>
        </div>
    );
}