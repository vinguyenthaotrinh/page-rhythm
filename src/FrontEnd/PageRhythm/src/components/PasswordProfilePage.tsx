import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/password-profile-page-styles.css";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from 'react-router-dom';

export default function PasswordProfilePage() {
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
            const profile = await server.getProfile(); // Fetch profile from server
            console.log(profile);
            setOriginalProfile({
                fullName: profile.data.full_name || "",
                email: profile.data.email || "",
                bio: profile.data.bio || "",
                birthday: profile.data.birthday != null ? `${profile.data.birthday["year"]}-${profile.data.birthday["month"]}-${profile.data.birthday["day"]}` : "",
            });
            setProfile({
                fullName: profile.data.full_name || "",
                email: profile.data.email || "",
                bio: profile.data.bio || "",
                birthday: profile.data.birthday != null ? `${profile.data.birthday["year"]}-${profile.data.birthday["month"]}-${profile.data.birthday["day"]}` : "",
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
                            <label>
                                Full Name:
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleInputChange}
                                    className="password-profile-page-profile-input"
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleInputChange}
                                    className="password-profile-page-profile-input"
                                />
                            </label>
                            <label>
                                Birthday:
                                <input
                                    type="date"
                                    name="birthday"
                                    value={profile.birthday}
                                    onChange={handleInputChange}
                                    className="password-profile-page-profile-input"
                                />
                            </label>
                            <label>
                                Bio:
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleInputChange}
                                    className="password-profile-page-profile-textarea"
                                />
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
                                <button type="button" onClick={handleReset} className="password-profile-page-profile-reset-button">
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
