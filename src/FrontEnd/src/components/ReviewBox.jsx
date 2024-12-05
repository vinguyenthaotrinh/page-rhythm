import React from 'react'
import images from '../assets/images'
import '../styles/review-box-styles.css'
import '../styles/fonts.css'

export default function ReviewBox() {
  return (
      <>
          <div className="rev-box">
              <h1 className="rev-box-title">Write a Review</h1>
              <img src="#" className="rev-img"></img>
              <h1 className="rev-box-title" id="rev-book-name">Book Name</h1>
              <p id="au-name">Author Name</p>
              <div className="rev-ratings">Ratings</div>
            
              <div className="rev-txt-btn">
                  <p id="rev">Reviews</p>
                  <div><textarea placeholder='Wrtie your review about this book' className='rev-text'></textarea></div>
                  <button className="rev-btn">Submit</button>
              </div>
          </div>
      </>
  )
}
