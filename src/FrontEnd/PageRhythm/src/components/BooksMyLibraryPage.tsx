import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/books-my-library-page-styles.css";
import { Link, useNavigate } from "react-router-dom";
import MyLibrarySectionBar from "./MyLibrarySectionBar";

export default function BooksMyLibraryPage() {
    const [books, setBooks] = useState<any[]>([]); // Books data state
    const [loading, setLoading] = useState(true);  // Loading state
    const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation box visibility
    const [bookToDelete, setBookToDelete] = useState<any | null>(null); // Track the selected book for deletion
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const server = await Server.getInstance();
                const response = await server.getUserUploadedBooks();
                setBooks(response);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleAddClick = () => {
        navigate("/add-book");
    };

    const handleDeleteClick = (book: any) => {
        setBookToDelete(book);      // Set the selected book
        setShowConfirmation(true);  // Show the confirmation box
    };

    const handleConfirmDelete = async () => {
        if (bookToDelete) {
            try {
                const server = await Server.getInstance();
                await server.deleteBook(bookToDelete.book_id); 
                setBooks(books.filter((b) => b.book_id !== bookToDelete.book_id)); // Remove book from state
                setBookToDelete(null);
                setShowConfirmation(false);
            } catch (error) {
                console.error("Error deleting book:", error);
            }
        }
    };

    const handleCancelDelete = () => {
        setBookToDelete(null);
        setShowConfirmation(false); // Close the confirmation box
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
                                        <div className="book-item-left-column">
                                            <img
                                                src={IMAGES.decodeBookCoverImage(book.image)}
                                                alt={book.title}
                                                className="book-item-cover"
                                            />
                                        </div>
                                        <div className="book-item-right-column">
                                            <p className="book-item-title">{book.title}</p>
                                            <p className="book-item-author">Author: {book.author}</p>
                                            <p className="book-item-release-date">
                                                Release Date: {book.releaseDate || "Unknown"}
                                            </p>
                                            <div className="book-item-buttons">
                                                <button className="book-item-edit-button">
                                                    Edit
                                                    <img
                                                        src={IMAGES.WHITE_PENCIL_ICON}
                                                        alt="Edit Icon"
                                                        className="book-item-button-icon"
                                                    />
                                                </button>
                                                <button
                                                    className="book-item-delete-button"
                                                    onClick={() => handleDeleteClick(book)}
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

            {/* Confirmation Box */}
            {showConfirmation && (
                <div className="books-my-library-page-deletion-confirmation-overlay">
                    <div className="books-my-library-page-deletion-confirmation-box">
                        <p>Are you sure you want to delete this book?</p>
                        <div className="books-my-library-page-deletion-confirmation-buttons">
                            <button
                                className="books-my-library-page-deletion-confirmation-button confirm"
                                onClick={handleConfirmDelete}
                            >
                                Yes
                            </button>
                            <button
                                className="books-my-library-page-deletion-confirmation-button cancel"
                                onClick={handleCancelDelete}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
