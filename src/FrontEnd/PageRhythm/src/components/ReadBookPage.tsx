import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/read-book-page-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ReadBookPage() {
    const [loading, setLoading]                 = useState(true);
    const { bookID }                            = useParams<{ bookID: string }>();
    const [book, setBook]                       = useState<any>(null);
    const [currentLeftPage, setCurrentLeftPage] = useState(1);
    const [contentPages, setContentPages]       = useState<string[]>([]);
    const navigate                              = useNavigate();
    const pageCapacity                          = 1600;
    const maximumLineLength                     = 80;
    
    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const handleListenButtonClick = () => {
        navigate(`/listen-to-book-page/${bookID}`); // Navigate to the ListenToBookPage component
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

                setBook(book);                              // Set the book details in state

                const pages = await server.getContentPages(parseInt(bookID), pageCapacity, maximumLineLength);  // Fetch the content pages
                setContentPages(pages);                     // Set the content pages in state

                const progress = await server.getTrackedReadingProgress(parseInt(bookID));  // Fetch the progress of reading the book

                if (progress && progress.status === "in_progress") 
                    setCurrentLeftPage(progress.page_number);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
            setLoading(false);
        };

        if (bookID) 
            fetchBookDetails(); 
        
    }, [bookID]); // Dependency array: fetch book details whenever the bookID changes

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

                if (currentLeftPage === contentPages.length) {
                    await server.trackProgressOfReadingBook(parseInt(bookID), currentLeftPage, "finished");  // Update the progress of reading the book
                } else {
                    await server.trackProgressOfReadingBook(parseInt(bookID), currentLeftPage, "in_progress");  // Update the progress of reading the book
                }
            } catch (error) {
                console.error("Error updating progress:", error);
            }
        }

        updateProgress(); 

    }, [currentLeftPage, loading]);

    if (!book) 
        return <div>Loading...</div>;

    const onLeftButtonClick = () => {
        if (currentLeftPage > 1) {
            setCurrentLeftPage(currentLeftPage - 1);
        }
    };

    const onRightButtonClick = () => {
        if (currentLeftPage < contentPages.length) {
            setCurrentLeftPage(currentLeftPage + 1);
        }
    };

    return (
        <div
            id = "read-book-page"
        >
            <NavigationBar />
            
            <div
                id  =   "read-book-page-top-region"
            >
                <div 
                    id      =   "read-book-page-back-button-container" 
                    onClick =   {handleBackClick}
                >
                    <img 
                        src         =   {IMAGES.LEFT_ARROW_ICON} 
                        alt         =   "Back" 
                        className   =   "read-book-page-back-button-icon" />
                    <span>Back</span>
                </div>

                <button
                    id              =   "read-book-page-listen-button"
                    className       =   "read-book-page-button"
                    onClick         =   {handleListenButtonClick}
                    onMouseEnter    =   {(e) => {
                        const imgElement = e.currentTarget.querySelector("img");
                        if (imgElement) 
                            imgElement.src = IMAGES.HOVERED_PLAY_BUTTON_ICON;
                    }}
                    onMouseLeave    =   {(e) => {
                        const imgElement = e.currentTarget.querySelector("img");
                        if (imgElement) 
                            imgElement.src = IMAGES.PLAY_BUTTON_ICON;
                    }}
                >   
                    <img
                        src         =   {IMAGES.PLAY_BUTTON_ICON}
                        alt         =   "Listen"
                        className   =   "read-book-page-button-icon"
                    />
                    Listen To Audio Book
                </button>
            </div>

            <div
                id = "read-book-page-content-region"
            >
                <div
                    id = "read-book-page-content-header"
                >

                    <div
                        id = "read-book-page-book-details-section"
                    >
                        <img
                            src     = {decodeBookCover(book.image)}
                            alt     = {book.title}
                            id      = "read-book-page-book-cover"
                            onClick = {() => navigate(`/book-details-page/${bookID}`)}
                        />
                        <div
                            id = "read-book-page-book-details"
                        >
                            <h1
                                id = "read-book-page-book-title"
                            >{book.title}</h1>
                            <h2
                                id = "read-book-page-book-author"
                            >{book.author}</h2>
                        </div>
                    </div>

                    <div
                        id = "read-book-page-navigation-section"
                    >
                        <button
                            className   =   "read-book-page-navigation-button"
                            onClick     =   {onLeftButtonClick}
                        >
                            <img src={IMAGES.LEFT_ICON} alt="Previous" className="read-book-page-navigation-icon" />
                        </button>

                        <span>
                            {currentLeftPage >= contentPages.length
                                ? `${currentLeftPage} of ${contentPages.length}`
                                : `Page ${currentLeftPage} & ${currentLeftPage + 1} of ${contentPages.length}`}
                        </span>

                        <button
                            className   =   "read-book-page-navigation-button"
                            onClick     =   {onRightButtonClick}
                        >
                            <img src={IMAGES.RIGHT_ICON} alt="Next" className="read-book-page-navigation-icon" />
                        </button>
                    </div>
                </div>

                <div id="read-book-page-content-body">
                    <div id="read-book-page-left-content-page" className="read-book-page-content-page">
                        {/* Check if the left page content is defined before rendering */}
                        {contentPages[currentLeftPage - 1] &&
                        contentPages[currentLeftPage - 1].split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                            {line}
                            <br />
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Conditionally hide the right page if it's the last page */}
                    {currentLeftPage < contentPages.length && contentPages[currentLeftPage] && (
                        <div id="read-book-page-right-content-page" className="read-book-page-content-page">
                        {/* Check if the right page content is defined before rendering */}
                        {contentPages[currentLeftPage].split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                            {line}
                            <br />
                            </React.Fragment>
                        ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}