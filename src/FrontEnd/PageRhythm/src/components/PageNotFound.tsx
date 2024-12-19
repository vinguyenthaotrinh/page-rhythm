import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/page-not-found-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="page-not-found">
            <NavigationBar />
            <div className="page-not-found-content">
                <h1>Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        </div>
    )
}