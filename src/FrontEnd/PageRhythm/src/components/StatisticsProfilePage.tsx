import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from "react-router-dom";
import "../styles/statistics-profile-page-styles.css";

function LoadingText() {
    return (
        <p
            id = "books-my-library-page-loading-text"
        >
            Loading...
        </p>
    );
}

function NoBookText() {
    return (
        <p
            id = "books-my-library-page-loading-text"
        >
            There is no book to display.
        </p>
    );
}

export default function StatisticsProfilePage() {
    const [books, setBooks]     = useState<any[]>([]);                                  // Books data state
    const [loading, setLoading] = useState(true);                                       // Loading state
    const navigate              = useNavigate();                                        // Navigation hook

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const server = await Server.getInstance();
                const response = await server.getAllUserReadingProgress();
                console.log(response);
                setBooks(response);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBooks();
    }, []);

    return (
        <div className="statistics-profile-page">
            <NavigationBar />
            <div className="statistics-profile-page-container">
                <ProfileSectionBar currentOption="statistics" />
                <div className="statistics-profile-page-profile-content">
                    <h1 id = "statistics-profile-page-title">Statistics</h1>

                    {/* Scrollable section for books */}
                    <div id="books-my-library-page-books-list-container">
                        {loading ? (<LoadingText />) : (books.length === 0 ? (<NoBookText />) :
                            <div id="books-my-library-page-books-grid">
                                {books.map((book, index) => (
                                    <div key={index} className="books-my-library-page-book-item">
                                        <div className="book-item-left-column">
                                            <img
                                                src={IMAGES.decodeBookCoverImage(book.image)}
                                                alt={book.title}
                                                onClick = {() => navigate(`/book-details-page/${book.book_id}`)}
                                                className="book-item-cover"
                                            />
                                        </div>
                                        <div className="book-item-right-column">
                                            <p className="book-item-title">{book.title}</p>
                                            <p className="book-item-author">Author: {book.author}</p>
                                            <p className="book-item-release-date">
                                                Release Date: {book.released_date || "Unknown"}
                                            </p>
                                            <div className="book-item-buttons">
                                                <button 
                                                    className="book-item-edit-button"
                                                >
                                                    Edit
                                                    <img
                                                        src={IMAGES.WHITE_PENCIL_ICON}
                                                        alt="Edit Icon"
                                                        className="book-item-button-icon"
                                                    />
                                                </button>
                                                <button
                                                    className="book-item-delete-button"
                                                >
                                                    Delete
                                                    <div className="book-item-button-icon">
                                                        <img
                                                            src={IMAGES.RED_TRASH_ICON}
                                                            alt="Delete Icon"
                                                            className="icon-normal"
                                                        />
                                                        <img
                                                            src={IMAGES.WHITE_TRASH_ICON}
                                                            alt="Delete Hover Icon"
                                                            className="icon-hover"
                                                        />
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
