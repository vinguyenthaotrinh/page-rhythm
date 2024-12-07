import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/book-details-page-styles.css";
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function BookDetailsPage() {
    const { bookID } = useParams<{ bookID: string }>();

    return (
        <div>
            <NavigationBar />
            <div id="book-details-page-content">
                <h1 id="book-details-page-title">Book Details</h1>
                <p id="book-details-page-description">This page will display details of a book {bookID}</p>
            </div>
        </div>
    )
}