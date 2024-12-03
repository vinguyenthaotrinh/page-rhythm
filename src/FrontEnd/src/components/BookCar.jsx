import React from 'react'

export default function BookCar() {
  return (
    <div className="book-card">
      <img src="https://via.placeholder.com/150" alt="Book Cover" />
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
