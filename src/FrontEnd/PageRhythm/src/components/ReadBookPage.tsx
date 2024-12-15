import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/read-book-page-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ReadBookPage() {

    const { bookID } = useParams<{ bookID: string }>();
    const [book, setBook] = useState<any>(null);
    const navigate = useNavigate();
    const pageCapacity = 1600;
    const maximumLineLength = 80;

    const [currentLeftPage, setCurrentLeftPage] = useState(1);
    const [contentPages, setContentPages] = useState<string[]>([]);
    
    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const decodeBookCover = (bookCover: string | null) => {
        if (!bookCover) {
            return IMAGES.DEFAULT_BOOK_COVER;
        }
        return `data:image/jpeg;base64,${bookCover}`;
    }

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                if (!bookID) {
                    console.error("Book ID is not available.");
                    return;
                }

                const server = await Server.getInstance();  // Get the server instance
                const book = await server.getBook(bookID);  // Fetch the book details using bookID

                setBook(book);  // Set the book details in state

                const pages = await server.getContentPages(parseInt(bookID), pageCapacity, maximumLineLength);  // Fetch the content pages
                setContentPages(pages);  // Set the content pages in state
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };

        if (bookID) {
            fetchBookDetails(); 
        }
    }, [bookID]); // Dependency array: fetch book details whenever the bookID changes

    if (!book) {
        return <div>Loading...</div>; // Placeholder while waiting for data
    }

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
                id = "read-book-page-top-region"
            >
                <div id="read-book-page-back-button-container" onClick={handleBackClick}>
                    <img src={IMAGES.LEFT_ARROW_ICON} alt="Back" className="read-book-page-back-button-icon" />
                    <span>Back</span>
                </div>

                <button
                    id = "read-book-page-listen-button"
                    className = "read-book-page-button"
                >   Listen To Audio Book
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
                            src = {decodeBookCover(book.image)}
                            alt = {book.title}
                            id = "read-book-page-book-cover"
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
                            className = "read-book-page-navigation-button"
                            onClick = {onLeftButtonClick}
                        >
                            <img src={IMAGES.LEFT_ICON} alt="Previous" className="read-book-page-navigation-icon" />
                        </button>

                        <span>
                            {currentLeftPage >= contentPages.length
                                ? `${currentLeftPage} of ${contentPages.length}`
                                : `Page ${currentLeftPage} & ${currentLeftPage + 1} of ${contentPages.length}`}
                        </span>

                        <button
                            className = "read-book-page-navigation-button"
                            onClick = {onRightButtonClick}
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