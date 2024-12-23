import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/listen-to-book-page-styles.css";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ListenToBookPage() {
    const [isPlaying, setIsPlaying]             =   useState(false);
    const [generatedAudio, setGeneratedAudio]   =   useState<any>(null);
    const [bookLoading, setBookLoading]         =   useState(true);
    const [voiceLoading, setVoiceLoading]       =   useState(true);
    const { bookID }                            =   useParams<{ bookID: string }>();
    const [book, setBook]                       =   useState<any>(null);
    const [currentPage, setCurrentPage]         =   useState(1);
    const [contentPages, setContentPages]       =   useState<string[]>([]);
    const [voice, setVoice]                     =   useState<string>("");
    const [voices, setVoices]                   =   useState<any[]>([]);
    const navigate                              =   useNavigate();
    const audioRef                              =   useRef<HTMLAudioElement | null>(null);
    const [audioTime, setAudioTime]             =   useState(0); 
    const pageCapacity                          =   1600;
    const maximumLineLength                     =   80;
    
    const handleBackClick = () => {
        navigate(-1);
    };

    const handleReadThisBookButtonClick = () => {
        navigate(`/read-book-page/${bookID}`);
    };

    const decodeBookCover = (bookCover: string | null) => {
        if (!bookCover) {
            return IMAGES.DEFAULT_BOOK_COVER;
        }
        return `data:image/jpeg;base64,${bookCover}`;
    }

    useEffect(() => {
        const fetchBookDetails = async () => {
            setBookLoading(true);
            try {
                if (!bookID) {
                    console.error("Book ID is not available.");
                    return;
                }

                const server    = await Server.getInstance();
                const book      = await server.getBook(bookID);

                setBook(book);

                const pages = await server.getContentPages(parseInt(bookID), pageCapacity, maximumLineLength);  // Fetch the content pages
                setContentPages(pages);                     // Set the content pages in state

                const progress = await server.getTrackedReadingProgress(parseInt(bookID));  // Fetch the progress of reading the book

                if (progress && progress.status === "in_progress") 
                    setCurrentPage(progress.page_number);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
            setBookLoading(false);
        };

        const fetchVoices = async () => {
            setVoiceLoading(true);
            try {
                const server = await Server.getInstance();
                const voices = await server.getAllUsableSampleVoices();
                setVoices(voices);
                setVoice(voices[0].voice_id);
            } catch (error) {
                console.error("Error fetching voices:", error);
            }
            setVoiceLoading(false);
        }

        if (bookID) {
            fetchBookDetails(); 
            fetchVoices();
        }
        
    }, [bookID]);

    useEffect(() => {
        if (bookLoading) 
            return;
        
        const updateProgress = async () => {
            try {
                if (!bookID) {
                    console.error("Book ID is not available.");
                    return;
                }

                const server = await Server.getInstance();

                if (currentPage === contentPages.length) {
                    await server.trackProgressOfReadingBook(parseInt(bookID), currentPage, "finished");
                } else {
                    await server.trackProgressOfReadingBook(parseInt(bookID), currentPage, "in_progress"); 
                }
            } catch (error) {
                console.error("Error updating progress:", error);
            }
        }

        updateProgress(); 

    }, [currentPage, bookLoading]);

    useEffect(() => {
        const generateAudioFile = async () => {
            if (!voice || !contentPages[currentPage - 1] || voiceLoading) 
                return;

            setGeneratedAudio(null);

            try {
                const server    = await Server.getInstance();
                const response  = await server.convertTextToSpeech(contentPages[currentPage - 1], voice);
                setGeneratedAudio(response);
            } catch (error) {
                console.error("Error generating audio file:", error);
            }
        };
    
        generateAudioFile();
    }, [voice, currentPage, contentPages]);

    if (!book) 
        return <div>Loading...</div>;

    const onLeftButtonClick = () => {
        if (currentPage > 1) 
            setCurrentPage(currentPage - 1);
    };

    const onRightButtonClick = () => {
        if (currentPage < contentPages.length) 
            setCurrentPage(currentPage + 1);
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        if (audioRef.current === null)
            return;

        const audio = audioRef.current;
            
        if (audio && audio.duration) {
            const seekTime = (event.target.valueAsNumber / 100) * audio.duration;
            audio.currentTime = seekTime;
    
            setAudioTime(seekTime);
        }
    };

    const handlePlayPause = () => {

        if (audioRef.current === null)
            return;

        const audio = audioRef.current;

        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const handleNext = () => {
        if (audioRef.current) {
            const newTime = audioRef.current.currentTime + 5;  // Move forward by 5 seconds
            if (newTime < audioRef.current.duration) {
                audioRef.current.currentTime = newTime;
            } else {
                audioRef.current.currentTime = audioRef.current.duration;  // Set to the max duration if beyond
            }
            setAudioTime(audioRef.current.currentTime);  // Update state
        }
    };
    
    // Handle the "Previous" button click to move backward a small amount of time (e.g., 5 seconds)
    const handlePrevious = () => {
        if (audioRef.current) {
            const newTime = audioRef.current.currentTime - 5;  // Move backward by 5 seconds
            if (newTime > 0) {
                audioRef.current.currentTime = newTime;
            } else {
                audioRef.current.currentTime = 0;  // Set to the start if before 0
            }
            setAudioTime(audioRef.current.currentTime);  // Update state
        }
    };

    return (
        <div
            id = "listen-to-book-page"
        >
            <NavigationBar />
            
            <div
                id  =   "listen-to-book-page-top-region"
            >
                <div 
                    id      =   "listen-to-book-page-back-button-container" 
                    onClick =   {handleBackClick}
                >
                    <img 
                        src         =   {IMAGES.LEFT_ARROW_ICON} 
                        alt         =   "Back" 
                        className   =   "listen-to-book-page-back-button-icon" 
                    />
                    <span>
                        Back
                    </span>
                </div>

                <div
                    id  =   "listen-to-book-page-top-region-right-part"
                >
                    <label className="listen-to-book-page-voice-header-text">Voice:</label>
                    <select
                        id          =   "listen-to-book-page-voice-select"
                        value       =   {voice}
                        onChange    =   {(e) => setVoice(e.target.value)}
                    >
                        {
                        voiceLoading ? (
                            <option>Loading...</option>
                        ) :
                        (
                            voices.map((voice) => (
                                <option 
                                    key     =   {voice.voice_name} 
                                    value   =   {voice.voice_id}
                                >
                                    {voice.voice_name}
                                </option>
                            ))
                        )
                        }
                    </select>

                    <button
                        id          =   "listen-to-book-page-read-button"
                        className   =   "listen-to-book-page-button"
                        onClick     =   {handleReadThisBookButtonClick}
                    >
                        Read This Book
                    </button>
                </div>
            </div>

            <div
                id = "listen-to-book-page-content-region"
            >
                <div
                    id = "listen-to-book-page-content-header"
                >

                    <div
                        id = "listen-to-book-page-book-details-section"
                    >
                        <img
                            src     =   {decodeBookCover(book.image)}
                            alt     =   {book.title}
                            id      =   "listen-to-book-page-book-cover"
                            onClick =   {() => navigate(`/book-details-page/${bookID}`)}
                        />
                        <div
                            id = "listen-to-book-page-book-details"
                        >
                            <h1
                                id = "listen-to-book-page-book-title"
                            >
                                {book.title}
                            </h1>
                            <h2
                                id = "listen-to-book-page-book-author"
                            >
                                {book.author}
                            </h2>
                        </div>
                    </div>

                    <div
                        id  =   "listen-to-book-page-audio-controls-section"
                    >
                        {
                            generatedAudio === null ? (
                                <p>
                                    Loading...
                                </p>
                            ) : (
                                <>
                                    <audio
                                        ref             =   {audioRef}
                                        src             =   {generatedAudio.audioData}

                                        onTimeUpdate    =   {() => {
                                            if (audioRef.current) 
                                                setAudioTime(audioRef.current.currentTime); // Access currentTime of the audio element
                                            }
                                        }

                                        onEnded        =   {() => {
                                            setIsPlaying(false)
                                            console.log("Audio ended");
                                        }
                                        }
                                    />

                                    <div
                                        className="audio-controls-top-row"
                                    >
                                        <button
                                            className       =   "audio-control-button previous-button"
                                            
                                            onMouseEnter    =   {(e)    => {
                                                const imgElement = e.currentTarget.querySelector("img");
                                                if (imgElement) 
                                                    imgElement.src = IMAGES.HOVERED_AUDIO_PREVIOUS_ICON;
                                            }}

                                            onMouseLeave    =   {(e) => {
                                                const imgElement = e.currentTarget.querySelector("img");
                                                if (imgElement) 
                                                    imgElement.src = IMAGES.AUDIO_PREVIOUS_ICON;
                                            }}

                                            onClick         =   {handlePrevious}
                                        >
                                            <img 
                                                src         =   {IMAGES.AUDIO_PREVIOUS_ICON}
                                                alt         =   "Previous"
                                                className   =   "audio-control-icon-previous" 
                                            />
                                        </button>

                                        <button
                                            className       =   "audio-control-button play-pause-button"

                                            onClick         =   {handlePlayPause}

                                            onMouseEnter    =   {(e)    => {
                                                const imgElement = e.currentTarget.querySelector("img");
                                                if (imgElement) {
                                                    if (isPlaying)
                                                        imgElement.src = IMAGES.HOVERED_AUDIO_PAUSE_ICON;
                                                    else 
                                                        imgElement.src = IMAGES.HOVERED_AUDIO_PLAY_ICON;
                                                }
                                            }}

                                            onMouseLeave    =   {(e) => {
                                                const imgElement = e.currentTarget.querySelector("img");
                                                if (imgElement) {
                                                    if (isPlaying)
                                                        imgElement.src = IMAGES.AUDIO_PAUSE_ICON;
                                                    else 
                                                        imgElement.src = IMAGES.AUDIO_PLAY_ICON;
                                                }
                                            }}
                                        >
                                            <img 
                                                src         =   {isPlaying ? IMAGES.AUDIO_PAUSE_ICON : IMAGES.AUDIO_PLAY_ICON}
                                                alt         =   {isPlaying ? "Pause" : "Play"}
                                                className   =   "audio-control-icon-play-pause" 
                                            />
                                        </button>

                                        <button
                                            className       =   "audio-control-button next-button"
                                        
                                            onMouseEnter    =   {(e)    => {
                                                const imgElement = e.currentTarget.querySelector("img");
                                                if (imgElement) 
                                                    imgElement.src = IMAGES.HOVERED_AUDIO_NEXT_ICON;
                                            }}

                                            onMouseLeave    =   {(e) => {
                                                const imgElement = e.currentTarget.querySelector("img");
                                                if (imgElement) 
                                                    imgElement.src = IMAGES.AUDIO_NEXT_ICON;
                                            }}

                                            onClick         =   {handleNext}
                                        >
                                            <img 
                                                src         =   {IMAGES.AUDIO_NEXT_ICON} 
                                                alt         =   "Next"
                                                className   =   "audio-control-icon-next"
                                            />
                                        </button>
                                    </div>

                                    <div
                                        className="audio-controls-bottom-row"
                                    >
                                        <span className="audio-time-left">
                                            00:00
                                        </span>

                                        <input
                                            type        =   "range"
                                            min         =   "0"
                                            max         =   "100"
                                            value       =   {audioRef.current?.duration ? (audioTime / audioRef.current.duration) * 100 : 0} 
                                            className   =   "audio-progress-slider"
                                            onChange    =   {(event) => handleSeek(event)}
                                        />

                                        <span className="audio-time-right">
                                            00:00
                                        </span>
                                    </div>
                                </>
                            )
                                
                        }

                    </div>

                    <div
                        id  =   "listen-to-book-page-navigation-section"
                    >
                        <button
                            className       =   "listen-to-book-page-navigation-button"
                            onClick         =   {onLeftButtonClick}
                        >
                            <img 
                                src         =   {IMAGES.LEFT_ICON} 
                                alt         =   "Previous" 
                                className   =   "listen-to-book-page-navigation-icon" 
                            />
                        </button>

                        <span>
                            {`${currentPage} of ${contentPages.length}`}
                        </span>

                        <button
                            className       =   "listen-to-book-page-navigation-button"
                            onClick         =   {onRightButtonClick}
                        >
                            <img 
                                src         =   {IMAGES.RIGHT_ICON} 
                                alt         =   "Next" 
                                className   =   "listen-to-book-page-navigation-icon" 
                            />
                        </button>
                    </div>
                </div>

                <div 
                    id  =   "listen-to-book-page-content-body"
                >

                    <div 
                        id          =   "listen-to-book-page-current-content-page" 
                        className   =   "listen-to-book-page-content-page"
                    >
                        {contentPages[currentPage - 1] && contentPages[currentPage - 1].split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}