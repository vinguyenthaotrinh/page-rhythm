import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/listen-to-book-page-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ListenToBookPage() {
    const [loading, setLoading]                 = useState(true);
    const { bookID }                            = useParams<{ bookID: string }>();
    const [book, setBook]                       = useState<any>(null);
    const [currentPage, setCurrentPage]         = useState(1);
    const [contentPages, setContentPages]       = useState<string[]>([]);
    const [voice, setVoice]                     = useState("en-US-Wavenet-D");
    const [voices, setVoices]                   = useState<any[]>([]);
    const navigate                              = useNavigate();
    const pageCapacity                          = 1600;
    const maximumLineLength                     = 80;
    
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
            setLoading(true);
            try {
                if (!bookID) {
                    console.error("Book ID is not available.");
                    return;
                }

                const server = await Server.getInstance();
                const book = await server.getBook(bookID);  // Fetch the book details using bookID

                setBook(book);

                const pages = await server.getContentPages(parseInt(bookID), pageCapacity, maximumLineLength);  // Fetch the content pages
                setContentPages(pages);                     // Set the content pages in state

                const progress = await server.getTrackedReadingProgress(parseInt(bookID));  // Fetch the progress of reading the book

                if (progress && progress.status === "in_progress") 
                    setCurrentPage(progress.page_number);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
            setLoading(false);
        };

        const fetchVoices = async () => {
            try {
                const server = await Server.getInstance();
                const voices = await server.getAllUsableSampleVoices();
                setVoices(voices);
                setVoice(voices[0].voice_name);
            } catch (error) {
                console.error("Error fetching voices:", error);
            }
        }

        const generateAudioFile = async () => {
            try {
                const server = await Server.getInstance();
                const response = await server.convertTextToSpeech(contentPages[currentPage - 1], voice);
                console.log("Audio file generated:", response);
            } catch (error) {
                console.error("Error generating audio file:", error);
            }
        }

        if (bookID) {
            fetchBookDetails(); 
            fetchVoices();
            generateAudioFile();
        }
        
    }, [bookID]);

    useEffect(() => {
        if (loading) 
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

    }, [currentPage, loading]);

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
                        {voices.map((voice) => (
                            <option 
                                key     =   {voice.voice_name} 
                                value   =   {voice.voice_id}
                            >
                                {voice.voice_name}
                            </option>
                        ))}
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
                            >{book.title}</h1>
                            <h2
                                id = "listen-to-book-page-book-author"
                            >{book.author}</h2>
                        </div>
                    </div>

                    <div
                        id="listen-to-book-page-audio-controls-section"
                    >
                        <div
                            className="audio-controls-top-row"
                        >
                            <button
                                className       =   "audio-control-button previous-button"
                                onClick         =   {() => console.log("Previous pressed")}
                            >
                                <img 
                                    src         =   {IMAGES.AUDIO_PREVIOUS_ICON}
                                    alt         =   "Previous"
                                    className   =   "audio-control-icon-previous" 
                                />
                            </button>

                            <button
                                className       =   "audio-control-button play-pause-button"
                                onClick         =   {() => console.log("Play/Pause pressed")}
                                
                            >
                                <img 
                                    src         =   {IMAGES.AUDIO_PLAY_ICON}
                                    alt         =   "Play/Pause" 
                                    className   =   "audio-control-icon-play-pause" 
                                />
                            </button>

                            <button
                                className       =   "audio-control-button next-button"
                                onClick         =   {() => console.log("Next pressed")}
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
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value="50"
                                className="audio-progress-slider"
                                onChange={(e) => console.log('Slider value:', e.target.value)}
                            />
                        </div>
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

                <div id="listen-to-book-page-content-body">
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