import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/books-my-library-page-styles.css";
import { Link, useNavigate } from 'react-router-dom';
import MyLibrarySectionBar from "./MyLibrarySectionBar"

export default function BooksMyLibraryPage() {
    return (
        <div id="books-my-library-page">
            <NavigationBar />
            <div id="books-my-library-page-container">
                <MyLibrarySectionBar currentOption="books" />
                <div id="books-my-library-page-content">
                    Hello
                </div>
            </div>
        </div>
    )
}