import React from 'react'
import PropTypes from "prop-types";
import "../styles/audio-card.css";
import Button from './Button';
import images from '../assets/images';
import { useState } from 'react';
// function AudioCard({theAudio}) {
//   return (
//     <div className="audio-card">
//       <div className="audio-card-info">
//         <h3>{title}</h3>
//         <audio controls>
//           <source src={audioSrc} type="audio/mpeg" />
//         </audio>
//         <div className ="audio-btn">
//         <Button 
//             text="Edit"
//             icon={images.user}
//             onClick={() => alert("Next button clicked!")}
//         />
//         <Button 
//             text="Delete"
//             icon={images.user}
//             border="1px solid #ff0000"
//             color="#ff0000"
//             backgroundColor="#fff"
//             onClick={() => alert("Next button clicked!")}
//         />
//         </div>
//       </div>
//     </div>
//   )
// }

// AudioCard.propTypes = {
//     title: PropTypes.string,       // Tiêu đề bài hát
    
//     audioSrc: PropTypes.string,    // URL của file audio
    
//   };
function AudioCard({ title, artist, audioUrl }){
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(new Audio(audioUrl));

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="audio-card">
      <div className="audio-info">
        <h3>{title}</h3>
        <p>{artist}</p>
      </div>
      <div className="audio-controls">
        <button onClick={togglePlay}>
          {/* {isPlaying ? 'Pause' : 'Play'} */}
          {isPlaying ? <img src={images.lock}/>:<img src={images.pencil}/>}
        </button>
      </div>
      <div className="audio-btn">
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
  );
};


  
export default AudioCard
