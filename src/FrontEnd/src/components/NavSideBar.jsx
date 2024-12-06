import React from 'react'
import { Link, NavLink } from "react-router-dom"
import '../styles/nav-side-bar.css'
export default function NavSideBar() {
  return (
        <nav className='nav-side-bar'>
            <ul>
                <li>
                    <NavLink to="/books">Books</NavLink>
                </li>
                <li>
                    <NavLink to="/voices">Voices</NavLink>
                </li>
            </ul>
        </nav>
  )
}
