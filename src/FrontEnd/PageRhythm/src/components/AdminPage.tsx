import IMAGES from "../images";
import Server from "../Server";
import "../styles/admin-page-styles.css"
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AdminPage() {
    return (
        <div className="admin-page">
            <NavigationBar />
            <div className="admin-page-content">
                <h1>Admin Page</h1>
                <p>Welcome, Admin!</p>
            </div>
        </div>
    )
}