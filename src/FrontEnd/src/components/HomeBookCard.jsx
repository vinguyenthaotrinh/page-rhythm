import React from 'react'
import images from '../assets/images'

export default function HomeBookCard({cards}) {
  return (
    <>
      <div id="item-list" className="item-list">
        {cards.map((item) => (
          <div className="item">
            <div className="item-head">
              <img src={images.logo1} class="item-image" />
              <div className="item-text-head">
                <h3 className="item-title">Title</h3>
                <p className="item-author">Author</p>
              </div>
            </div>
            <div className="item-details">
              <div className="item-rating"><p>Ratings</p></div>
              <div className="item-category"><p>Genre</p></div>
              <div className="item-release-date"><p>Release date</p></div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
