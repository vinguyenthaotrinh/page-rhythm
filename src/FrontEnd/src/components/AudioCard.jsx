import React from 'react'
import PropTypes from "prop-types";
import "../styles/card.css";
import Button from './Button';
import images from '../assets/images'
function AudioCard({title="Audio Name", audioSrc={}}) {
  return (
    <div className="audio-card">
      <div className="audio-card-info">
        <h3>{title}</h3>
        <audio controls>
          <source src={audioSrc} type="audio/mpeg" />
        </audio>
        <div className ="audio-btn">
        <Button 
            text="Edit"
            icon={images.user}
            onClick={() => alert("Next button clicked!")}
        />
        <Button 
            text="Delete"
            icon={images.user}
            border="1px solid #ff0000"
            color="#ff0000"
            backgroundColor="#fff"
            onClick={() => alert("Next button clicked!")}
        />
        </div>
      </div>
    </div>
  )
}

AudioCard.propTypes = {
    title: PropTypes.string,       // Tiêu đề bài hát
    
    audioSrc: PropTypes.string,    // URL của file audio
    
  };
  
export default AudioCard
