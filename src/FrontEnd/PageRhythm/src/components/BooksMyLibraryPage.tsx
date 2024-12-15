import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/books-my-library-page-styles.css";
import { Link, useNavigate } from "react-router-dom";
import MyLibrarySectionBar from "./MyLibrarySectionBar"
import { decode } from "punycode";

export default function BooksMyLibraryPage() {
    const [books, setBooks] = useState<any[]>([]);  // Books data state
    const [loading, setLoading] = useState(true);   // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const server = await Server.getInstance();
                const response = await server.getUserUploadedBooks(); // Call the correct method
                setBooks(response); // Update the state with fetched books
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleAddClick = () => {
        navigate("/add-book");  // Assuming this is the page where users can add new books
    };

    return (
        <div id="books-my-library-page">
            <NavigationBar />
            <div id="books-my-library-page-container">
                <MyLibrarySectionBar currentOption="books" />
                <div id="books-my-library-page-content">
                    <button 
                        id="books-my-library-page-add-book-button" 
                        onClick={handleAddClick}
                    >
                        Add
                        <img 
                            src={IMAGES.ADD_ICON} 
                            alt="Add Icon" 
                            className="books-my-library-page-add-icon" 
                        /> 
                    </button>

                    {/* Scrollable section for books */}
                    <div id="books-my-library-page-books-list-container">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div id="books-my-library-page-books-grid">
                                {books.map((book, index) => (
                                    <div key={index} className="books-my-library-page-book-item">
                                        {/* Left column for book cover */}
                                        <div className="book-item-left-column">
                                            <img 
                                                src={IMAGES.decodeBookCoverImage(book.image)} 
                                                alt={book.title} 
                                                className="book-item-cover" 
                                            />
                                        </div>

                                        {/* Right column for book details */}
                                        <div className="book-item-right-column">
                                            <p className="book-item-title">{book.title}</p>
                                            <p className="book-item-author">Author: {book.author}</p>
                                            <p className="book-item-release-date">Release Date: {book.releaseDate}</p>
                                            <div className="book-item-buttons">
                                                {/* Edit Button */}
                                                <button className="book-item-edit-button">
                                                    Edit
                                                    <img src={IMAGES.WHITE_PENCIL_ICON} alt="Edit Icon" className="book-item-button-icon" />
                                                </button>
                                                {/* Delete Button */}
                                                <button className="book-item-delete-button">
                                                    Delete
                                                    <div className="book-item-button-icon">
                                                        <img src={IMAGES.RED_TRASH_ICON} alt="Delete Icon" className="icon-normal" />
                                                        <img src={IMAGES.WHITE_TRASH_ICON} alt="Delete Hover Icon" className="icon-hover" />
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
    )
}