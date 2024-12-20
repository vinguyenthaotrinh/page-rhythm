import "../styles/fonts.css";
import IMAGES from "../images";
import Server from "../Server";
import "../styles/navigation-bar-styles.css";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function LogoSectionOfNavigationBar() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/home-page");
    };

    return (
        <div
            className="navigation-bar-left"
            role="button"
            tabIndex={0}
            onClick={handleLogoClick}
            onKeyDown={(e) => e.key === "Enter" && handleLogoClick()}
            style={{ cursor: "pointer" }}
        >
            <img src={IMAGES.LOGO} alt="PageRhythm Logo" className="navigation-bar-logo" />
            <h1 className="navigation-bar-title">PageRhythm</h1>
        </div>
    );
}

function ProfilePictureSectionOfNavigationBar({
    profilePicture,
    onProfileClick,
}: {
    profilePicture: string;
    onProfileClick: () => void;
}) {
    return (
        <img
            src={profilePicture}
            alt="User Avatar"
            className="navigation-bar-avatar"
            role="button"
            tabIndex={0}
            onClick={onProfileClick}
            style={{ cursor: "pointer" }}
        />
    );
}

export default function NavigationBar() {
    const [accountType, setAccountType] = useState("user");
    const [profilePicture, setProfilePicture] = useState(IMAGES.DEFAULT_PROFILE_PICTURE);
    const navigate = useNavigate();

    const handleProfilePictureClick = () => {
        navigate("/profile-page");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const server = await Server.getInstance();
                const profile = await server.getProfile();

                if (profile) {
                    if (profile.data.account_type) 
                        setAccountType(profile.data.account_type);
                    if (profile.data.profile_picture)
                        setProfilePicture(IMAGES.decodeProfilePicture(profile.data.profile_picture));
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <>
            <nav>
                <LogoSectionOfNavigationBar />
                <div className="navigation-bar-right">
                    <ul>
                        <li>
                            <NavLink to="/home-page">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/my-library-page">My Library</NavLink>
                        </li>
                        {
                            (accountType === "admin") && (
                                <li>
                                    <NavLink to="/admin-page">Admin</NavLink>
                                </li>
                            )
                        }
                    </ul>

                    <ProfilePictureSectionOfNavigationBar
                        profilePicture={profilePicture}
                        onProfileClick={handleProfilePictureClick}
                    />
                </div>
            </nav>
        </>
    );
}
