import React from 'react'
import '../styles/search-bar.css'
import '../styles/fonts.css'
import images from '../assets/images'
import PropTypes from "prop-types";
export default function SearchBar({fontSize, width}) {
  return (
    <div className="search-bar">
      <img src={images.search}/>
      <input 
      style={{
        fontSize:fontSize,
        width:width,
      }}
      type="text" placeholder="Search Your Books" />
    </div>
  )
}

SearchBar.PropTypes={
  fontSize: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
}