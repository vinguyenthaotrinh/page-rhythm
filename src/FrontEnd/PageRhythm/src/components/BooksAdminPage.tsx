import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/books-admin-page-styles.css";
import AdminSectionBar from "./AdminSectionBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface DeletionConfirmationBoxProps {
    title?: string;             // Optional custom title
    message?: string;           // Confirmation message
    onConfirm: () => void;      // Function to call when confirmed
    onCancel: () => void;       // Function to call when canceled
}

const DeletionConfirmationBox: React.FC<DeletionConfirmationBoxProps> = ({
    onConfirm,
    onCancel,
}) => {
    return (
        <div className="books-admin-page-deletion-confirmation-overlay">
            <div className="books-admin-page-deletion-confirmation-box">
                <h1 id="books-admin-page-deletion-confirmation-title">Delete your book</h1>
                <p>Are you sure you want to delete this book?</p>
                <div className="books-admin-page-deletion-confirmation-buttons">
                    <button
                        className="books-admin-page-deletion-confirmation-button confirm"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="books-admin-page-deletion-confirmation-button cancel"
                        onClick={onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

interface EditBookOverlayProps {
    showEditOverlay:    boolean;
    setShowEditOverlay: React.Dispatch<React.SetStateAction<boolean>>;
    selectedBook:       any | null;
    setSelectedBook:    React.Dispatch<React.SetStateAction<any | null>>;
    handleEditBook:     (updatedBook: any) => void;
}

const EditBookOverlay: React.FC<EditBookOverlayProps> = ({
    showEditOverlay,
    setShowEditOverlay,
    selectedBook,
    setSelectedBook,
    handleEditBook,
}) => {
    const [bookName, setBookName]                       = useState(selectedBook?.title || "");
    const [authorName, setAuthorName]                   = useState(selectedBook?.author || "");
    const [releaseDate, setReleaseDate]                 = useState<string | null>(selectedBook?.release_date || "");
    const [genre, setGenre]                             = useState<string | null>(selectedBook?.genre || "");
    const [summary, setSummary]                         = useState(selectedBook?.summary || "");
    const [selectedCoverImage, setSelectedCoverImage]   = useState<File | null>(null); // Add cover image upload if necessary

    useEffect(() => {
        // Reset form values when selectedBook changes
        if (selectedBook) {
            setBookName(selectedBook.title);
            setAuthorName(selectedBook.author);
            setReleaseDate(selectedBook.release_date);
            setGenre(selectedBook.genre);
            setSummary(selectedBook.summary);
        }
    }, [selectedBook]);

    const handleBookEdit = () => {
        const updatedBook = {
            ...selectedBook,
            title: bookName,
            author: authorName,
            release_date: releaseDate,
            genre: genre,
            summary: summary,
            image: selectedCoverImage || selectedBook?.image, // Keep old image if not updating
        };
        handleEditBook(updatedBook); // Pass the updated book data
        setShowEditOverlay(false); // Close the overlay
    };

    if (!showEditOverlay || !selectedBook) return null;

    return (
        <div className="add-overlay">
            <div className="add-overlay-content">
                <h1 id="add-overlay-title">Edit Book Information</h1>
                <p>Edit the book details below</p>

                <input
                    type="text"
                    placeholder="Book Name"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Author Name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Release Date"
                    value={releaseDate || ""}
                    onChange={(e) => setReleaseDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Genre (optional)"
                    value={genre || ""}
                    onChange={(e) => setGenre(e.target.value)}
                />
                <textarea
                    placeholder="Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                />

                <div className="file-input-container">
                    <label htmlFor="cover-image-input" className="file-input-label">
                        Upload Cover Image (optional)
                    </label>
                    <input
                        type="file"
                        id="cover-image-input"
                        onChange={(e) => setSelectedCoverImage(e.target.files?.[0] || null)}
                        accept="image/*"
                        className="file-input-button"
                    />

                    {selectedCoverImage && (
                        <div className="file-name-display">
                            {selectedCoverImage.name}
                        </div>
                    )}
                </div>

                <div className="add-overlay-buttons">
                    <button onClick={handleBookEdit}>Save Changes</button>
                    <button onClick={() => setShowEditOverlay(false)}>Close</button>
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

export default function BooksAdminPage() {
    const [books, setBooks] = useState<any[]>([]);                                      // Books data state
    const [loading, setLoading] = useState(true);                                       // Loading state
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(false);                    // Confirmation box visibility
    const [bookToDelete, setBookToDelete] = useState<any | null>(null);                 // Track the selected book for deletion
    const [selectedFile, setSelectedFile] = useState<File | null>(null);                // Track the selected file for upload
    const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);    // Track the cover image file
    const [showEditOverlay, setShowEditOverlay] = useState(false);                      // State for Edit Overlay
    const [selectedBook, setSelectedBook] = useState<any | null>(null);                 // State for selected book
    const navigate = useNavigate();

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
        setBookToDelete(book);      // Set the selected book
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

    const handleEditClick = (book: any) => {
        setSelectedBook(book);
        setShowEditOverlay(true);  // Show the edit overlay
    };

    const handleEditBook = async (updatedBook: any) => {
        try {
            const server = await Server.getInstance();
            await server.updateBook(updatedBook);
            setBooks(books.map((book) =>
                book.book_id === updatedBook.book_id ? updatedBook : book
            )); // Update book list with the new details
            setSelectedBook(null);
            setShowEditOverlay(false);
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };

    return (
        <div id="books-admin-page">
            <NavigationBar />

            <div id="books-admin-page-container">
                <AdminSectionBar currentOption="books" />
                <div id="books-admin-page-content">
                    
                    {/* Scrollable section for books */}
                    <div id="books-admin-page-books-list-container">
                        {loading ? (<LoadingText />) : (
                            <div id="books-admin-page-books-grid">
                                {books.map((book, index) => (
                                    <div key={index} className="books-admin-page-book-item">
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
                                                    onClick = {() => handleEditClick(book)}
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
            {showDeletionConfirmation && (
                <DeletionConfirmationBox
                    onConfirm   =   {handleConfirmDelete}
                    onCancel    =   {handleCancelDelete}
                />
            )}

            <EditBookOverlay
                showEditOverlay={showEditOverlay}
                setShowEditOverlay={setShowEditOverlay}
                selectedBook={selectedBook}
                setSelectedBook={setSelectedBook}
                handleEditBook={handleEditBook}
            />
        </div>
    );
}
