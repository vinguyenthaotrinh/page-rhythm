import IMAGES from "../images";
import Server from "../Server";
import "../styles/home-page-styles.css";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {
    return (
        <div>
            <NavigationBar />
            <div id="home-page-content">
                <h1 id="home-page-title">Welcome to PageRhythm</h1>
                <p id="home-page-description">Your one-stop destination for all your reading needs</p>
            </div>
        </div>
    )
}