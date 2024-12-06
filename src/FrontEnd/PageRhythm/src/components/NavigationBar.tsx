import React from "react"
import IMAGES from "../images"
import "../styles/fonts.css"
import "../styles/navigation-bar-styles.css"
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

export default function NavigationBar() {
   return(
       <>
           <nav>
                <LogoSectionOfNavigationBar />
                <div className="navigation-bar-right">
                   <ul>
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/mylibrary">My Library</NavLink>
                        </li>
                    </ul>
                    <img src={IMAGES.LOGO} alt="User Avatar" className="navigation-bar-avatar" />
                </div>
            </nav>
       </>
   )
}