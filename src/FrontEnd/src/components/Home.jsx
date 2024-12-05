import React, { useState, useEffect } from 'react';
import '../styles/home-styles.css';
import '../styles/landing-style.css';
import HomeBookCard from './HomeBookCard';
import images from'../assets/images';

export default function Home() {
  const [items, setItems] = useState([
    {
      title: "Item 1",
      author: "A",
      category: "This is a description of item 1.",
      image: "images/Logo.png",
      rating: 4,
      release_date: "1/12/2024"
    },
    {
      title: "Item 2",
      author: "B",
      category: "This is a description of item 2.",
      image: "images/Logo.png",
      rating: 3,
      release_date: "1/12/2024"
    }
  ]);

  useEffect(()=>{
    console.log("useEffect runs");
  });

  return (
    <>
      <div className="input-container" id="home-search-bar">
        <img src={images.search} className="input-icon" />
        <input
          type="text"
          id="searchInput"
          placeholder="Search..."
          onInput="handleSearch()"
          className="input-info"
        />

      </div>
      <ul id="searchResults"></ul>

      <div className="header-row">
        <div className="header-item">Title</div>
        <div className="header-item">Ratings</div>
        <div className="header-item">Category</div>
        <div className="header-item">Release Date</div>
      </div>

      <div id="item-list" className="item-list">
        <HomeBookCard cards={items}/>
      </div>
    </>
  )
}
