import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/book-details-page-styles.css";
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function BookDetailsPage() {
    const { bookID } = useParams<{ bookID: string }>();

    return (
        <div
            id = "book-details-page"
        >
            <NavigationBar />
            <div
                id = "back-button-container"
            >
                Back
            </div>
        </div>
    )
}