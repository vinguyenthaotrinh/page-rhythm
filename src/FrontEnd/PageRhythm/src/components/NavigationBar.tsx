import "../styles/fonts.css"
import IMAGES from "../images"
import Server from "../Server"
import "../styles/navigation-bar-styles.css"
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"

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
            onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
            style={{ cursor: 'pointer' }}
        >
            <img src={IMAGES.LOGO} alt="PageRhythm Logo" className="navigation-bar-logo" />
            <h1 className="navigation-bar-title">PageRhythm</h1>
        </div>
    );
}

function ProfilePictureSectionOfNavigationBar() {
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

                if (profile && profile.data.profile_picture) {
                    // Convert base64 string back to image source (data URL format)
                    setProfilePicture(`data:image/jpeg;base64,${profile.data.profile_picture}`);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <img 
            src={profilePicture} 
            alt="User Avatar" 
            className="navigation-bar-avatar" 
            role="button"
            tabIndex={0}
            onClick={handleProfilePictureClick}
            style={{ cursor: 'pointer' }}
        />
    );
}

export default function NavigationBar() {

    return(
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
                    </ul>
                    <ProfilePictureSectionOfNavigationBar />
                </div>
            </nav>
        </>
   )
}