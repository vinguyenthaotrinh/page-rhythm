import React from 'react';
import '../styles/home-styles.css';
import '../styles/landing-style.css';

import images from'../assets/images';

export default function Home() {
  return (
    <>
      <div class="input-container" id="home-search-bar">
        <image src={images.search} class="input-icon" />
        <input
          type="text"
          id="searchInput"
          placeholder="Search..."
          oninput="handleSearch()"
          class="input-info"
        />

      </div>
      <ul id="searchResults"></ul>

      <div class="header-row">
        <div class="header-item">Title</div>
        <div class="header-item">Ratings</div>
        <div class="header-item">Category</div>
        <div class="header-item">Release Date</div>
      </div>

      <div id="item-list" class="item-list"></div>
    </>
  )
}
