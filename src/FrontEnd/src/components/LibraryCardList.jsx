import React from 'react'
import '../styles/card-list-styles.css'
import '../styles/my-library-styles.css'
import images from '../assets/images'

import {AudioCard, BookCard, Button, SearchBar} from '../components'
export default function LibraryCardList(cards, isBook) {
  const books = [
    { id: 1, title: 'Book Name', author: 'Author Name', releaseDate: 'Release Date' },
    { id: 2, title: 'Book Name', author: 'Author Name', releaseDate: 'Release Date' },
    { id: 3, title: 'Book Name', author: 'Author Name', releaseDate: 'Release Date' },
    { id: 4, title: 'Book Name', author: 'Author Name', releaseDate: 'Release Date' },
  ];
  return (
    <>
      <div className='list-container'>
        <div className='inner-list' id='search-card'>
          <Button text="Add" className='add-search' />
          <span className='search-item'>
            <SearchBar fontSize='small' width='300px' />
          </span>
        </div>
        <div className='inner-list' id='card-list'>
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </>
  )
}
