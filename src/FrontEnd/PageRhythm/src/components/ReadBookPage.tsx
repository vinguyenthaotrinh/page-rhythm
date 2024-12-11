import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/read-book-page-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ReadBookPage() {

    const { bookID } = useParams<{ bookID: string }>();
    const navigate = useNavigate();
    
    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div
            id = "read-book-page"
        >
            <NavigationBar />
            <div
                id = "read-book-page-top-region"
            >
                <div id="read-book-page-back-button-container" onClick={handleBackClick}>
                    <img src={IMAGES.LEFT_ARROW_ICON} alt="Back" className="read-book-page-back-button-icon" />
                    <span>Back</span>
                </div>

                <button
                    id = "read-book-page-listen-button"
                    className = "read-book-page-button"
                >   Listen To Audio Book
                </button>
            </div>
        </div>
    )
}