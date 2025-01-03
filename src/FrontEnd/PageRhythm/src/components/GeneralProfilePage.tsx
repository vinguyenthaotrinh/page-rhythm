import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/general-profile-page-styles.css";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from "react-router-dom";

function LoadingText() {
    return (
        <p
            id  =   "statistics-profile-page-loading-text"
        >
            Loading...
        </p>
    );
}

export default function GeneralProfilePage() {
    const [originalProfile, setOriginalProfile]     = useState({
        fullName:   "",
        email:      "",
        bio:        "",
        birthday:   "",
    });

    const [loading, setLoading]                     = useState(true);
    const [profile, setProfile]                     = useState({ ...originalProfile });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [error, setError]                         = useState("");

    const loadProfile = async () => {
        try {
            setLoading(true);
            const server    =   await Server.getInstance();
            const profile   =   await server.getProfile(); // Fetch profile from server
            
            const formattedProfile = {
                fullName:   profile.data.full_name  || "",
                email:      profile.data.email      || "",
                bio:        profile.data.bio        || "",
                birthday:   profile.data.birthday 
                            ? `${profile.data.birthday.year}-${profile.data.birthday.month}-${profile.data.birthday.day}`
                            : "",
            };

            setOriginalProfile(formattedProfile);
            
            setProfile(formattedProfile);

            setLoading(false);
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
        setHasUnsavedChanges(true);
    };

    const handleSave = async () => {
        const today = new Date().toISOString().split("T")[0];
        if (profile.birthday > today) {
            setError("Date of birth cannot be later than today's date.");
            return;
        }

        const nameRegex = /[a-zA-Z]/;
        if (!nameRegex.test(profile.fullName)) {
            setError("The entered input for the fullname is invalid.");
            return;
        }

        try {
            const server = await Server.getInstance();
            await server.updateProfile(profile);
            setOriginalProfile(profile);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    const handleReset = () => {
        setProfile({ ...originalProfile });
        setHasUnsavedChanges(false);
    };

    return (
        <div 
            className   =   "general-profile-page"
        >
            <NavigationBar />
            <div 
                className   =   "general-profile-page-container"
            >
                <ProfileSectionBar 
                    currentOption   =   "general" 
                />
                <div 
                    className   =   "general-profile-page-profile-content"
                >
                    <h1 
                        id  =   "general-profile-page-title"
                    >
                        General Information
                    </h1>
                    <div
                        id  =   "general-profile-page-profile-information-section"
                    >
                        {
                            loading ? <LoadingText /> : (
                                <form 
                                    className   =   "general-profile-page-profile-form"
                                >
                                    <label 
                                        className   =   "general-profile-page-input-label"
                                    >
                                        Full Name:
                                        <div 
                                            className   =   "general-profile-page-input-container"
                                        >
                                            <img 
                                                src         =   {IMAGES.USER_ICON} 
                                                alt         =   "Full Name Icon" 
                                                className   =   "general-profile-page-input-icon" 
                                            />
                                            <input
                                                type        =   "text"
                                                name        =   "fullName"
                                                value       =   {profile.fullName}
                                                onChange    =   {handleInputChange}
                                                className   =   "general-profile-page-profile-input"
                                            />
                                        </div>
                                    </label>
                                    <label 
                                        className   =   "general-profile-page-input-label"
                                    >
                                        Email:
                                        <div 
                                            className   =   "general-profile-page-input-container"
                                        >
                                            <img 
                                                src         =   {IMAGES.MAIL_ICON} 
                                                alt         =   "Email Icon" 
                                                className   =   "general-profile-page-input-icon" 
                                            />
                                            <input
                                                type        =   "email"
                                                name        =   "email"
                                                value       =   {profile.email}
                                                onChange    =   {handleInputChange}
                                                className   =   "general-profile-page-profile-input"
                                            />
                                        </div>
                                    </label>
                                    <label 
                                        className   =   "general-profile-page-input-label"
                                    >
                                        Birthday (DD/MM/YYYY):
                                        <div 
                                            className   =   "general-profile-page-input-container"
                                        >
                                            <img 
                                                src         =   {IMAGES.CALENDAR_ICON} 
                                                alt         =   "Birthday Icon" 
                                                className   =   "general-profile-page-input-icon" 
                                            />
                                            <input
                                                type        =   "date"
                                                name        =   "birthday"
                                                value       =   {profile.birthday}
                                                onChange    =   {handleInputChange}
                                                className   =   "general-profile-page-profile-input"
                                            />
                                        </div>
                                    </label>
                                    <label 
                                        className   =   "general-profile-page-input-label"
                                    >
                                        Bio:
                                        <div 
                                            className   =   "general-profile-page-input-container"
                                        >
                                            <img 
                                                src         =   {IMAGES.BLACK_PENCIL_ICON} 
                                                alt         =   "Bio Icon" 
                                                className   =   "general-profile-page-input-icon" 
                                                id          =   "general-profile-page-bio-icon"
                                            />
                                            <textarea
                                                name        =   "bio"
                                                value       =   {profile.bio}
                                                onChange    =   {handleInputChange}
                                                className   =   "general-profile-page-profile-textarea"
                                                rows        =   {8}
                                            />
                                        </div>
                                    </label>

                                    {error  &&  
                                        <div
                                            className   =   "landing-page-error-message"
                                        >
                                            {error}
                                        </div>}

                                    <div 
                                        className   =   "general-profile-page-profile-buttons"
                                    >
                                        <button
                                            type        =   "button"
                                            onClick     =   {handleSave}
                                            className   =   {`general-profile-page-profile-save-button ${hasUnsavedChanges ? "active" : ""}`}
                                            disabled    =   {!hasUnsavedChanges}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            type        =   "button" 
                                            onClick     =   {handleReset} 
                                            className   =   "general-profile-page-profile-reset-button"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
