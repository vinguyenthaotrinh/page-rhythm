import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/password-profile-page-styles.css";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from 'react-router-dom';

export default function PasswordProfilePage() {

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmedNewPassword: ""
    });

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPasswords((previous) => {
            const updatedPasswords = { ...previous, [name]: value };
            console.log(updatedPasswords); // Log updated value here
            return updatedPasswords;
        });
        setHasUnsavedChanges(true);
    };

    const handleSave = async () => {
        try {
            const server = await Server.getInstance();
            //await server.changePassword(passwords);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error while saving profile", error);
        }
    };

    return (
        <div className="password-profile-page">
            <NavigationBar />
            <div className="password-profile-page-container">
                <ProfileSectionBar currentOption="password" />
                <div className="password-profile-page-profile-content">
                    <h1 id = "password-profile-page-title">Change Your Password Here</h1>
                    <div
                        id = "password-profile-page-profile-information-section"
                    >
                        <form className="password-profile-page-profile-form">
                            <label className="password-profile-page-input-label">
                                Enter your current password:
                                <div className="password-profile-page-input-container">
                                    <img src={IMAGES.LOCK_ICON} alt="Lock Icon" className="password-profile-page-input-icon" />
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwords.currentPassword}
                                        onChange={handleInputChange}
                                        className="password-profile-page-profile-input"
                                    />
                                </div>
                            </label>
                            <label className="password-profile-page-input-label">
                                Enter your new password:
                                <div className="password-profile-page-input-container">
                                    <img src={IMAGES.LOCK_ICON} alt="Lock Icon" className="password-profile-page-input-icon" />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handleInputChange}
                                        className="password-profile-page-profile-input"
                                    />
                                </div>
                            </label>
                            <label className="password-profile-page-input-label">
                                Confirm your new password:
                                <div className="password-profile-page-input-container">
                                    <img src={IMAGES.LOCK_ICON} alt="Lock Icon" className="password-profile-page-input-icon" />
                                    <input
                                        type="password"
                                        name="confirmedNewPassword"
                                        value={passwords.confirmedNewPassword}
                                        onChange={handleInputChange}
                                        className="password-profile-page-profile-input"
                                    />
                                </div>
                            </label>
                            <div className="password-profile-page-profile-buttons">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className={`password-profile-page-profile-save-button ${hasUnsavedChanges ? "active" : ""}`}
                                    disabled={!hasUnsavedChanges}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
