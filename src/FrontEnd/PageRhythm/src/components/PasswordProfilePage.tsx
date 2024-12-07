import IMAGES from "../images";
import Server from "../Server";
import React, { useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/password-profile-page-styles.css";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from 'react-router-dom';

export default function PasswordProfilePage() {
    return (
        <div className="password-profile-page">
            <NavigationBar />
            <div className="password-profile-page-container">
                <ProfileSectionBar currentOption="password" />
                <div className="password-profile-page-profile-content">
                    <h1 id = "password-profile-page-title">Password</h1>
                    <p>You can change your password here</p>
                </div>
            </div>
        </div>
    );
}
