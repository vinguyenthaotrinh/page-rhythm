import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/voices-my-library-page-styles.css";
import { Link, useNavigate } from 'react-router-dom';
import MyLibrarySectionBar from "./MyLibrarySectionBar"

export default function VoicesMyLibraryPage() {
    return (
        <div id="voices-my-library-page">
            <NavigationBar />
            <div id="voices-my-library-page-container">
                <MyLibrarySectionBar currentOption="voices" />
                <div id="voices-my-library-page-content">
                    Hello
                </div>
            </div>
        </div>
    )
}