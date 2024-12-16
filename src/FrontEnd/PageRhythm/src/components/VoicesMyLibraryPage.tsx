import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/voices-my-library-page-styles.css";
import { Link, useNavigate } from "react-router-dom";
import MyLibrarySectionBar from "./MyLibrarySectionBar"
import React, { useState, useRef, useEffect } from "react";

export default function VoicesMyLibraryPage() {
    const [showAddOverlay, setShowAddOverlay] = useState(false); // State for Add Overlay
    const [records, setRecords] = useState([
        { id: 1, name: "Audio 1", file: "/path/to/audio1.mp3" },
        { id: 2, name: "Audio 2", file: "/path/to/audio2.mp3" },
        { id: 3, name: "Audio 2", file: "/path/to/audio2.mp3" },
        { id: 4, name: "Audio 2", file: "/path/to/audio2.mp3" },
        { id: 5, name: "Audio 2", file: "/path/to/audio2.mp3" },
        { id: 6, name: "Audio 2", file: "/path/to/audio2.mp3" },
        { id: 7, name: "Audio 2", file: "/path/to/audio2.mp3" },
    ]); // Example records array
    const [playingIndex, setPlayingIndex] = useState<number | null>(null); // Track currently playing audio
    const [audioTime, setAudioTime] = useState(0); // Track current time of audio

    const handleAddClick = () => {
        setShowAddOverlay(true); // Show the overlay
    };

    const audioRefs = useRef<Record<number, HTMLAudioElement>>({}); // Create refs for each audio file

    const handlePlayPause = (index: number) => {
        const audio = audioRefs.current[index];
        if (audio.paused) {
            audio.play();
            setPlayingIndex(index);
        } else {
            audio.pause();
            setPlayingIndex(null);
        }
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const audio = audioRefs.current[index];
        
        // Ensure audio.duration is a valid number
        if (audio && audio.duration) {
            const seekTime = (event.target.valueAsNumber / 100) * audio.duration;
            audio.currentTime = seekTime;
            setAudioTime(seekTime);
        } else {
            console.warn("Audio duration not available yet.");
        }
    };

    const handleDelete = (index: number) => {
        // Delete logic
        const updatedRecords = records.filter((record) => record.id !== index);
        setRecords(updatedRecords);
    };

    const handleEdit = (index: number) => {
        // Edit logic
        console.log("Edit record", index);
    };

    return (
        <div id="voices-my-library-page">
            <NavigationBar />
            <div id="voices-my-library-page-container">
                <MyLibrarySectionBar currentOption="voices" />
                <div id="voices-my-library-page-content">
                    <button
                        id="voices-my-library-page-add-book-button"
                        onClick={handleAddClick}
                    >
                        Add
                        <img
                            src={IMAGES.ADD_ICON}
                            alt="Add Icon"
                            className="voices-my-library-page-add-icon"
                        />
                    </button>

                    {/* Scrollable section for records */}
                    <div id="voices-my-library-page-record-list-container">
                        {records.map((record, index) => (
                            <div key={record.id} className="record-item">
                                <div className="record-header">
                                    <span className="audio-name">{record.name}</span>
                                </div>

                                <div className="record-body">
                                    {/* Left Column */}
                                    <div className="record-left-column">
                                        <audio
                                            ref={(el) => (audioRefs.current[index] = el!)}
                                            src={record.file}
                                            onTimeUpdate={() =>
                                                setAudioTime(audioRefs.current[index].currentTime)
                                            }
                                        />
                                        <button
                                            className="play-pause-btn"
                                            onClick={() => handlePlayPause(index)}
                                        >
                                            {playingIndex === index ? "Pause" : "Play"}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={(audioTime / audioRefs.current[index]?.duration) * 100 || 0}
                                            onChange={(event) => handleSeek(event, index)}
                                            className="audio-slider"
                                        />
                                    </div>

                                    {/* Right Column */}
                                    <div className="record-right-column">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(record.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}