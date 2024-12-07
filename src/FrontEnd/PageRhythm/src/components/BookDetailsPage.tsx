import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/book-details-page-styles.css";
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function BookDetailsPage() {
    const { bookID } = useParams<{ bookID: string }>();
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div
            id = "book-details-page"
        >
            <NavigationBar />
            <div
                id = "book-details-page-back-button-region"
            >
                <div id="book-details-page-back-button-container" onClick={handleBackClick}>
                    <img src={IMAGES.LEFT_ARROW_ICON} alt="Back" className="book-details-page-back-button-icon" />
                    <span>Back</span>
                </div>
            </div>
            <div
                id = "book-details-page-main-section"
            >
                Hello
            </div>
        </div>
    )
}