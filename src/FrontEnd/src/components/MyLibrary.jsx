import React from 'react'
// import SideBar from './SideBar'
// import SearchBar from './SearchBar'
import BookCard from './BookCard.jsx'
import '../styles/my-library-styles.css'
import '../styles/landing-style.css'

import { NavLink } from 'react-router-dom'
import '../styles/home-styles.css'
import images from '../assets/images'

export default function MyLibrary() {

  const books = [
    { id: 1, title: 'Book Name', author: 'Author Name', releaseDate: 'Release Date' },
    { id: 2, title: 'Book Name', author: 'Author Name', releaseDate: 'Release Date' },
    { id: 3, title: 'Book Name', author: 'Author Name', releaseDate: 'Release Date' },
    { id: 4, title: 'Book Name', author: 'Author Name', releaseDate: 'Release Date' },
  ];
  return (
    <>
      {/* <div className="library">
        <Sidebar />
        <div className="content">
          <SearchBar />
          <div className="books-grid">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div> */}
      <image src={images.search} class="search-icon" />
      <div className="library-title">
        <h1>My Library</h1>
      </div>
      <div className="library">
        <div className="box" id="side-bar">
          <nav class="nav-side-bar">
            <ul>
              <li>
                <NavLink to="/mylibrary/books">Books</NavLink>
              </li>
              <li>
                <NavLink to="/mylibrary/voices">Voices</NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="box" id="content-card">
          <div className="tools" id="book-search">
            <div className="book-search-inner">
            <button className="add-button">Add</button>
            </div>
            <div class="book-search-inner" id="library-search-bar">
              <img src={images.search} className="search-icon" />
              <input
                type="text"
                id="searchInput"
                placeholder="Search Your Books"
                onInput="handleSearch()"
                class="input-info"
              />
            </div>
          </div>
          <div className="tools" id="books-grid">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
        
      </div>
    </>
  )
}
