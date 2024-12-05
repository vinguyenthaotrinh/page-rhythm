import React from 'react'
import images from '../assets/images'
import '../styles/my-library-styles.css'

export default function BookCard({book}) {
  return (
    <div className="book-card">
      <img src="#" alt="Book Cover" />
      <div className="book-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.releaseDate}</p>
        <div className="buttons">
          <button className="edit-button">Edit</button>
          <button className="delete-button">Delete</button>
        </div>
      </div>
    </div>
  )
}
