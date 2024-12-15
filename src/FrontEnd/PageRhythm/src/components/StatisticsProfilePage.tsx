import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/statistics-profile-page-styles.css";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from "react-router-dom";

export default function StatisticsProfilePage() {
    return (
        <div className="statistics-profile-page">
            <NavigationBar />
            <div className="statistics-profile-page-container">
                <ProfileSectionBar currentOption="statistics" />
                <div className="statistics-profile-page-profile-content">
                    <h1 id = "statistics-profile-page-title">Statistics</h1>
                </div>
            </div>
        </div>
    );
}
