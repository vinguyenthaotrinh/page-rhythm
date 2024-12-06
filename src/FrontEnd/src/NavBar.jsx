 import React from "react"
 import { Link, NavLink } from "react-router-dom"
 import './NavBar.css'
 import images from './assets/images';
 import './styles/fonts.css';
 function NavBar(){
    return(
        <>
            
                <nav className="core-nav">
                    <div className="navbar-left">
                        <img src={images.logo1} alt="PageRhythm Logo" className="navbar-logo" />
                        <h1 className="navbar-title">PageRhythm</h1>
                    </div>
                    <div className="navbar-right">
                        <ul>
                            <li>
                                <NavLink to="/">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/mylibrary">My Library</NavLink>
                            </li>
                        </ul>
                        <img src={images.logo1} alt="User Avatar" className="navbar-avatar" />
                    </div>
                </nav>
            
        </>
    )
 }
 export default NavBar