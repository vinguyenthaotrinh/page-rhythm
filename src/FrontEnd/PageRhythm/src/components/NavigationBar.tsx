import React from "react"
import IMAGES from "../images"
import "../styles/fonts.css"
import "../styles/navigation-bar-styles.css"
import { Link, NavLink } from "react-router-dom"

export default function NavigationBar() {
   return(
       <>
           
               <nav>
                   <div className="navbar-left">
                       <img src={IMAGES.LOGO} alt="PageRhythm Logo" className="navbar-logo" />
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
                       <img src={IMAGES.LOGO} alt="User Avatar" className="navbar-avatar" />
                   </div>
               </nav>
           
       </>
   )
}