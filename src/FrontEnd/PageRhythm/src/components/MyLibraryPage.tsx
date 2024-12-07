import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/my-library-page-styles.css";
import { Link, useNavigate } from 'react-router-dom';

export default function MyLibraryPage() {
    return (
        <div>
            <NavigationBar />
            <div id="my-library-page-content">
                <h1 id="my-library-page-title">My Library</h1>
                <p id="my-library-page-description">Your personal collection of books</p>
            </div>
        </div>
    )
}