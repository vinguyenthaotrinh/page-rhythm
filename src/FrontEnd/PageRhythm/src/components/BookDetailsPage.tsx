import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/book-details-page-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function BookDetailsPage() {
    const { bookID } = useParams<{ bookID: string }>();
    const [book, setBook] = useState<any>(null);
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const decodeBookCover = (bookCover: string | null) => {
        if (!bookCover) {
            return IMAGES.DEFAULT_BOOK_COVER;
        }
        return `data:image/jpeg;base64,${bookCover}`;
    }
    
    // Fetch book details from the server
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
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };

        if (bookID) {
            fetchBookDetails(); // Fetch details when the component mounts
        }
    }, [bookID]); // Dependency array: fetch book details whenever the bookID changes

    if (!book) {
        return <div>Loading...</div>; // Placeholder while waiting for data
    }

    const getStarRating = (rating: number) => {
        const roundedRating = Math.round(rating);
        let stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < roundedRating) {
                stars.push(<img key={i} src={IMAGES.FILLED_STAR_ICON} alt="Star" className="star-icon" />);
            } else {
                stars.push(<img key={i} src={IMAGES.EMPTY_STAR_ICON} alt="Star" className="star-icon" />);
            }
        }
        return stars;
    }

    return (
        <div
            id = "book-details-page"
        >
            <NavigationBar />
            <div
                id = "book-details-page-back-button-region"
            >
                <div id="book-details-page-back-button-container" onClick={handleBackClick}>
                    <img src={IMAGES.LEFT_ARROW_ICON} alt="Back" className="book-details-page-back-button-icon" />
                    <span>Back</span>
                </div>
            </div>
            <div
                id = "book-details-page-main-section"
            >
                <div
                    id = "book-details-page-information-section"
                >
                    {/* Left Column (Book Cover) */}
                    <div id="book-details-page-cover">
                        <img src={decodeBookCover(book.cover)} alt="Book Cover" />
                    </div>

                    {/* Right Column (Book Information) */}
                    <div id="book-details-page-introduction">
                        {/* Book Title and Buttons */}
                        <div className="book-details-page-title-row">
                            <h2>{book.title}</h2>
                            <div className="book-details-page-buttons">
                                <button
                                    id = "book-details-page-read-button"
                                    className = "book-details-page-button"
                                >
                                    Read This Book
                                </button>
                                <button
                                    id = "book-details-page-listen-button"
                                    className = "book-details-page-button"
                                >   Listen To Audio Book
                                </button>
                            </div>
                        </div>

                        {/* Author Name */}
                        <div className="book-details-row">
                            <strong>Author:</strong> {book.author}
                        </div>

                        {/* Rating */}
                        {
                            book && book.rating && (
                                <div className="book-details-row">
                                    <strong>Rating:</strong>
                                    <div className="star-rating">
                                    {getStarRating(book.rating)}
                                    <span>{book.rating}</span>
                                    </div>
                                </div>
                            )
                        }

                        {/* Release Date */}
                        <div className="book-details-row">
                            <strong>Release Date:</strong> {new Date(book.released_date).toLocaleDateString()}
                        </div>

                        {/* Genre */}
                        <div className="book-details-row">
                            <strong>Genre:</strong> {book.genre}
                        </div>

                        {/* Summary */}
                        <div className="book-details-row">
                            <strong>Summary:</strong> {book.summary}
                        </div>
                    </div>
                </div>
            </div>
            <div
                id = "book-details-page-review-section"
            >
                Rating & Comments
                <button>
                    Write a comment
                </button>
                {/*Click one of five stars to give a rating or click the highest enabled star to roll-back a given rating*/}
            </div>
        </div>
    )
}