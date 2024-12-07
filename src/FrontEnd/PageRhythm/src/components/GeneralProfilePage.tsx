import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/general-profile-page-styles.css";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from 'react-router-dom';

export default function GeneralProfilePage() {
    return (
        <div className="general-profile-page">
            <NavigationBar />
            <div className="general-profile-page-container">
                <ProfileSectionBar currentOption="general" />
                <div className="general-profile-page-profile-content">
                    <h1 id = "general-profile-page-title">General Information</h1>
                    <div
                        id = "general-profile-page-profile-information-section"
                    >
                        Fill here
                    </div>
                </div>
            </div>
        </div>
    );
}
