import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/books-admin-page-styles.css";
import AdminSectionBar from "./AdminSectionBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BookDeletionConfirmationBox from "./BookDeletionConfirmationBox";

interface VisibilityConfirmationBoxProps {
    showVisibilityConfirmation:     boolean;            
    message?:                       string;             
    onConfirm:                      () => void;        
    onCancel:                       () => void;        
}

const VisibilityConfirmationBox: React.FC<VisibilityConfirmationBoxProps> = ({
    showVisibilityConfirmation,
    message,
    onConfirm                       =   () => {},
    onCancel                        =   () => {},
}) => {

    if (!showVisibilityConfirmation)
        return null;

    return (
        <div className="books-admin-page-visibility-confirmation-overlay">
            <div className="books-admin-page-visibility-confirmation-box">
                <h1 id="books-admin-page-visibility-confirmation-title">Confirm Action</h1>
                <p>{message}</p>
                <div 
                    className   =   "books-admin-page-visibility-confirmation-buttons"
                >
                    <button
                        className   =   "books-admin-page-visibility-confirmation-button confirm"
                        onClick     =   {onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className   =   "books-admin-page-visibility-confirmation-button cancel"
                        onClick     =   {onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

function LoadingText() {
    return (
        <p
            id = "books-admin-page-loading-text"
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

export default function BooksAdminPage() {
    const [books, setBooks]                                             = useState<any[]>([]);              // Books data state
    const [loading, setLoading]                                         = useState(true);
    const [showDeletionConfirmation, setShowDeletionConfirmation]       = useState(false);
    const [bookToDelete, setBookToDelete]                               = useState<any | null>(null);    
    const [showVisibilityConfirmation, setShowVisibilityConfirmation]   = useState(false);
    const [visibilityMessage, setVisibilityMessage]                     = useState("");
    const [bookToToggle, setBookToToggle]                               = useState<any | null>(null);
    const navigate                                                      = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const server = await Server.getInstance();
                const response = await server.getAllBooksInRandomOrder();
                setBooks(response);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleDeleteClick = (book: any) => {
        setBookToDelete(book);              // Set the selected book
        setShowDeletionConfirmation(true);  // Show the confirmation box
    };

    const handleConfirmDelete = async () => {
        if (bookToDelete) {
            try {
                const server = await Server.getInstance();
                await server.deleteBook(bookToDelete.book_id); 
                setBooks(books.filter((b) => b.book_id !== bookToDelete.book_id)); // Remove book from state
                setBookToDelete(null);
                setShowDeletionConfirmation(false);
            } catch (error) {
                console.error("Error deleting book:", error);
            }
        }
    };

    const handleCancelDelete = () => {
        setBookToDelete(null);
        setShowDeletionConfirmation(false); // Close the confirmation box
    };

    const handleVisibilityClick = (book: any) => {
        setBookToToggle(book);
        const action = book.hidden ? "Unhide" : "Hide";
        setVisibilityMessage(`Are you sure you want to ${action} this book?`);
        setShowVisibilityConfirmation(true);
    };

    const handleConfirmToggleVisibility = async () => {
        if (bookToToggle) {
            try {
                const server = await Server.getInstance();
                const updatedBook = {
                    ...bookToToggle,
                    hidden: !bookToToggle.hidden,
                };
                await server.toggleBookVisibility(bookToToggle.book_id);
                setBooks(books.map((book) =>
                    book.book_id === bookToToggle.book_id ? updatedBook : book
                ));
                setBookToToggle(null);
                setShowVisibilityConfirmation(false);
            } catch (error) {
                console.error("Error toggling book visibility:", error);
            }
        }
    };

    const handleCancelToggleVisibility = () => {
        setBookToToggle(null);
        setShowVisibilityConfirmation(false);
    };

    return (
        <div id="books-admin-page">
            <NavigationBar />

            <div id="books-admin-page-container">
                <AdminSectionBar currentOption="books" />
                <div id="books-admin-page-content">
                    <h1 id = "general-profile-page-title">Admin</h1>
                    {/* Scrollable section for books */}
                    <div id="books-admin-page-books-list-container">
                        {loading ? (<LoadingText />) : (books.length === 0 ? (<NoBookText />) :
                            (
                                <div id="books-admin-page-books-grid">
                                    {books.map((book, index) => (
                                        <div 
                                            key         =   {index} 
                                            className   =   "books-admin-page-book-item">
                                            <div 
                                                className   =   "book-item-left-column"
                                            >
                                                <img
                                                    src         =   {IMAGES.decodeBookCoverImage(book.image)}
                                                    alt         =   {book.title}
                                                    onClick     =   {() => navigate(`/book-details-page/${book.book_id}`)}
                                                    className   =   "book-item-cover"
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
                                                        className   =   "book-item-visibility-button"
                                                        onClick     =   {() => handleVisibilityClick(book)}
                                                    >
                                                        {book.hidden ? "Unhide" : "Hide"}
                                                        <img
                                                            src         =   {
                                                                book.hidden
                                                                    ? IMAGES.EYE_OPEN_ICON
                                                                    : IMAGES.EYE_CLOSED_ICON
                                                            }
                                                            alt         =   "Visibility Icon"
                                                            className   =   "book-item-button-icon"
                                                        />
                                                    </button>
                                                    <button
                                                        className           =   "book-item-delete-button"
                                                        onClick             =   {() => handleDeleteClick(book)}
                                                    >
                                                        Delete
                                                        <div className="book-item-button-icon">
                                                            <img
                                                                src         =   {IMAGES.RED_TRASH_ICON}
                                                                alt         =   "Delete Icon"
                                                                className   =   "icon-normal"
                                                            />
                                                            <img
                                                                src         =   {IMAGES.WHITE_TRASH_ICON}
                                                                alt         =   "Delete Hover Icon"
                                                                className   =   "icon-hover"
                                                            />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <VisibilityConfirmationBox
                showVisibilityConfirmation  =   {showVisibilityConfirmation}
                message                     =   {visibilityMessage}
                onConfirm                   =   {handleConfirmToggleVisibility}
                onCancel                    =   {handleCancelToggleVisibility}
            />

            <BookDeletionConfirmationBox
                showDeletionConfirmation    =   {showDeletionConfirmation}
                onConfirm                   =   {handleConfirmDelete}
                onCancel                    =   {handleCancelDelete}
            />

        </div>
    );
}
