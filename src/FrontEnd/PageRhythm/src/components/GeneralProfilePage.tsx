import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/general-profile-page-styles.css";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from 'react-router-dom';

export default function GeneralProfilePage() {
    const [originalProfile, setOriginalProfile] = useState({
        fullName: "",
        email: "",
        bio: "",
        birthday: "",
    });

    const [profile, setProfile] = useState({ ...originalProfile });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const loadProfile = async () => {
        try {
            const server = await Server.getInstance();
            const profileData = await server.getProfile(); // Fetch profile from server
            setOriginalProfile({
                fullName: profileData.full_name || "",
                email: profileData.email || "",
                bio: profileData.bio || "",
                birthday: profileData.birthday || "",
            });
            setProfile({
                fullName: profileData.full_name || "",
                email: profileData.email || "",
                bio: profileData.bio || "",
                birthday: profileData.birthday || "",
            });
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
        try {
            const server = await Server.getInstance();
            //await server.updateProfile(profile); // Replace with actual API call to update profile
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
        <div className="general-profile-page">
            <NavigationBar />
            <div className="general-profile-page-container">
                <ProfileSectionBar currentOption="general" />
                <div className="general-profile-page-profile-content">
                    <h1 id = "general-profile-page-title">General Information</h1>
                    <div
                        id = "general-profile-page-profile-information-section"
                    >
                        <form className="profile-form">
                            <label>
                                Full Name:
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleInputChange}
                                    className="profile-input"
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleInputChange}
                                    className="profile-input"
                                />
                            </label>
                            <label>
                                Bio:
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleInputChange}
                                    className="profile-textarea"
                                />
                            </label>
                            <label>
                                Birthday:
                                <input
                                    type="date"
                                    name="birthday"
                                    value={profile.birthday}
                                    onChange={handleInputChange}
                                    className="profile-input"
                                />
                            </label>
                            <div className="profile-buttons">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className={`profile-save-button ${hasUnsavedChanges ? "active" : ""}`}
                                    disabled={!hasUnsavedChanges}
                                >
                                    Save
                                </button>
                                <button type="button" onClick={handleReset} className="profile-reset-button">
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
