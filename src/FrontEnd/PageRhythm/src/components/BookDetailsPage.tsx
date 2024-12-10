import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/book-details-page-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function BookDetailsPage() {
    const { bookID } = useParams<{ bookID: string }>();
    const [book, setBook] = useState<any>(null);

    const [userRating, setUserRating] = useState<number | null>(null); // User-selected rating

    const handleRating = async (rating: number) => {
        const server = await Server.getInstance();

        if (!bookID) {
            console.error("Book ID is undefined. Cannot delete rating.");
            return; // Exit early if bookID is undefined
        }

        try {
            if (rating === userRating) {
                // If the user clicks the currently selected rating, reset the rating

                if (userRating !== null) {
                    await server.deleteBookRating(bookID); // Delete the existing rating
                    console.log("Rating deleted successfully.");
                }

                setUserRating(null); 
            } else {

                // Delete the existing rating before updating
                if (userRating !== null && userRating !== undefined) {
                    await server.deleteBookRating(bookID);
                    console.log("Existing rating deleted successfully.");
                }
                
                // Update the rating
                setUserRating(rating); // Update the rating locally
                await server.insertBookRating(bookID, rating); // Send the new rating to the server
                console.log(`Rating updated to ${rating}.`);
            }
        } catch (error) {
            console.error("Error handling rating:", error);
        }
    };

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

        const fetchUserRating = async () => {
            try {
                if (!bookID) {
                    console.error("Book ID is not available.");
                    return;
                }

                const server = await Server.getInstance();
                const rating = await server.getBookRating(bookID); // Fetch user rating
                if (rating) {
                    setUserRating(rating.rating); // Set the user rating in state
                    console.log("User rating fetched successfully.", rating);
                }
            } catch (error) {
                console.error("Error fetching user rating:", error);
            }
        };

        if (bookID) {
            fetchBookDetails(); // Fetch details when the component mounts
            fetchUserRating(); // Fetch user rating when the component mounts
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
                            book && book.book_rating && (
                                <div className="book-details-row">
                                    <strong>Rating:</strong>
                                    <div className="star-rating">
                                    {getStarRating(book.book_rating)}
                                    <span>{book.book_rating}</span>
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
            <div id="book-details-page-review-section">
                <strong>Rating & Comments:</strong>
                <div className="review-section-content">
                    <button className="write-comment-button">Write a comment</button>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <img
                                key={star}
                                src={star <= (userRating || 0) ? IMAGES.FILLED_STAR_ICON : IMAGES.EMPTY_STAR_ICON}
                                alt={`${star} Star`}
                                className="star-icon"
                                onClick={() => handleRating(star)} // Handle click to set rating
                            />
                        ))}
                    </div>                
                </div>
            </div>
        </div>
    )
}