import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/password-profile-page-styles.css";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from "react-router-dom";

export default function PasswordProfilePage() {

    const [passwords, setPasswords] = useState({
        currentPassword:        "",
        newPassword:            "",
        confirmedNewPassword:   ""
    });

    const [hasUnsavedChanges, setHasUnsavedChanges]                 =   useState(false);
    const [showCurrentPassword, setShowCurrentPassword]             =   useState(false);
    const [showNewPassword, setShowNewPassword]                     =   useState(false);
    const [showConfirmedNewPassword, setShowConfirmedNewPassword]   =   useState(false);
    const [error, setError]                                         =   useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPasswords((previous) => {
            const updatedPasswords = { ...previous, [name]: value };
            return updatedPasswords;
        });
        setHasUnsavedChanges(true);
    };

    const handleSave = async () => {
        try {
            const server = await Server.getInstance();
            await server.changePassword(passwords);
            setHasUnsavedChanges(false);
            setPasswords({
                currentPassword:        "",
                newPassword:            "",
                confirmedNewPassword:   ""
            });
            setError("");
        } catch (error) {
            console.error("Error while saving profile", error);
            setError("An error occurred while saving the password. Please try again.");
        }
    };

    const togglePasswordVisibility = (field: string) => {
        if (field === "currentPassword")
            setShowCurrentPassword(!showCurrentPassword);
        else if (field === "newPassword") 
            setShowNewPassword(!showNewPassword);
        else if (field === "confirmedNewPassword") 
            setShowConfirmedNewPassword(!showConfirmedNewPassword);
    };

    return (
        <div 
            className   =   "password-profile-page"
        >
            <NavigationBar />
            <div 
                className   =   "password-profile-page-container"
            >
                <ProfileSectionBar 
                    currentOption   =   "password" 
                />
                <div 
                    className   =   "password-profile-page-profile-content"
                >
                    <h1 
                        id  =   "password-profile-page-title"
                    >
                        Change Your Password Here
                    </h1>
                    <div
                        id  =   "password-profile-page-profile-information-section"
                    >
                        <form 
                            className   =   "password-profile-page-profile-form"
                        >
                            <label 
                                className   =   "password-profile-page-input-label"
                            >
                                Enter your current password:
                                <div 
                                    className       =   "password-profile-page-input-container"
                                >
                                    <img 
                                        src         =   {IMAGES.LOCK_ICON} 
                                        alt         =   "Lock Icon" 
                                        className   =   "password-profile-page-input-icon" 
                                    />
                                    <input
                                        type        =   {showCurrentPassword ? "text" : "password"}
                                        name        =   "currentPassword"
                                        value       =   {passwords.currentPassword}
                                        onChange    =   {handleInputChange}
                                        className   =   "password-profile-page-profile-input"
                                    />
                                    <img
                                        src         =   {showCurrentPassword ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}
                                        alt         =   "Toggle Visibility"
                                        className   =   "password-profile-page-eye-icon"
                                        onClick     =   {() => togglePasswordVisibility("currentPassword")}
                                    />
                                </div>
                            </label>
                            <label 
                                className           =   "password-profile-page-input-label"
                            >
                                Enter your new password:
                                <div    
                                    className       =   "password-profile-page-input-container"
                                >
                                    <img 
                                        src         =   {IMAGES.LOCK_ICON} 
                                        alt         =   "Lock Icon" 
                                        className   =   "password-profile-page-input-icon" 
                                    />
                                    <input
                                        type        =   {showNewPassword ? "text" : "password"}
                                        name        =   "newPassword"
                                        value       =   {passwords.newPassword}
                                        onChange    =   {handleInputChange}
                                        className   =   "password-profile-page-profile-input"
                                    />
                                    <img
                                        src         =   {showNewPassword ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}
                                        alt         =   "Toggle Visibility"
                                        className   =   "password-profile-page-eye-icon"
                                        onClick     =   {() => togglePasswordVisibility("newPassword")}
                                    />
                                </div>
                            </label>
                            <label 
                                className   =   "password-profile-page-input-label"
                            >
                                Confirm your new password:
                                <div 
                                    className   =   "password-profile-page-input-container"
                                >
                                    <img 
                                        src         =   {IMAGES.LOCK_ICON} 
                                        alt         =   "Lock Icon" 
                                        className   =   "password-profile-page-input-icon" 
                                    />
                                    <input
                                        type        =   {showConfirmedNewPassword ? "text" : "password"}
                                        name        =   "confirmedNewPassword"
                                        value       =   {passwords.confirmedNewPassword}
                                        onChange    =   {handleInputChange}
                                        className   =   "password-profile-page-profile-input"
                                    />
                                    <img
                                        src         =   {showConfirmedNewPassword ? IMAGES.EYE_ON_ICON : IMAGES.EYE_OFF_ICON}
                                        alt         =   "Toggle Visibility"
                                        className   =   "password-profile-page-eye-icon"
                                        onClick     =   {() => togglePasswordVisibility("confirmedNewPassword")}
                                    />
                                </div>
                            </label>

                            {/* Show error message if it's not null or empty */}
                            {error && 
                                <div 
                                    className   =   "password-profile-page-error-message"
                                >
                                    {error}
                                </div>
                            }

                            <div 
                                className   =   "password-profile-page-profile-buttons"
                            >
                                <button
                                    type        =   "button"
                                    onClick     =   {handleSave}
                                    className   =   {`password-profile-page-profile-save-button ${hasUnsavedChanges ? "active" : ""}`}
                                    disabled    =   {!hasUnsavedChanges}
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
