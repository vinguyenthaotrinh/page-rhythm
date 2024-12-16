import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/books-my-library-page-styles.css";
import { Link, useNavigate } from "react-router-dom";
import MyLibrarySectionBar from "./MyLibrarySectionBar";

interface DeletionConfirmationBoxProps {
    title?: string;             // Optional custom title
    message?: string;           // Confirmation message
    onConfirm: () => void;      // Function to call when confirmed
    onCancel: () => void;       // Function to call when canceled
}

const DeletionConfirmationBox: React.FC<DeletionConfirmationBoxProps> = ({
    title = "Delete your book", // Default title
    message = "Are you sure you want to delete this book?", // Default message
    onConfirm,
    onCancel,
}) => {
    return (
        <div className="books-my-library-page-deletion-confirmation-overlay">
            <div className="books-my-library-page-deletion-confirmation-box">
                <h1 id="books-my-library-page-deletion-confirmation-title">{title}</h1>
                <p>{message}</p>
                <div className="books-my-library-page-deletion-confirmation-buttons">
                    <button
                        className="books-my-library-page-deletion-confirmation-button confirm"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="books-my-library-page-deletion-confirmation-button cancel"
                        onClick={onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function BooksMyLibraryPage() {
    const [books, setBooks] = useState<any[]>([]);                      // Books data state
    const [loading, setLoading] = useState(true);                       // Loading state
    const [showConfirmation, setShowConfirmation] = useState(false);    // Confirmation box visibility
    const [bookToDelete, setBookToDelete] = useState<any | null>(null); // Track the selected book for deletion
    const [showAddOverlay, setShowAddOverlay] = useState(false);        // State for Add Overlay
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Track the selected file for upload
    const [bookName, setBookName] = useState("");                       // Book name input
    const [authorName, setAuthorName] = useState("");                   // Author name input
    const [releaseDate, setReleaseDate] = useState<string | null>("");  // Release date input
    const [genre, setGenre] = useState<string | null>("");              // Genre input
    const [summary, setSummary] = useState("");                         // Summary input
    const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null); // Track the cover image file
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
        setShowAddOverlay(true);  // Show the overlay
    };

    const handleCoverImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedCoverImage(file); // Track the selected cover image
    
            // Optionally, create a preview of the image
            const reader = new FileReader();
            reader.onloadend = () => {
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleBookUpload = async () => {
        if (selectedFile && bookName && authorName) {
            // Prepare the book object
            const book = {
                title: bookName,
                author: authorName,
                summary,
                genre,
                content: selectedFile,
                image: selectedCoverImage || null, // Optional cover image
            };

            console.log("Uploading book with details:", book);

            // Initialize the server instance
            const server = await Server.getInstance();

            // Call the `uploadBook` method
            await server.uploadBook(book);

            // Update UI after successful upload
            console.log("Book uploaded successfully!");

            const renderedBook = {
                title: bookName,
                author: authorName,
                summary,
                genre,
                content: selectedFile,
                image: selectedCoverImage ? await IMAGES.convertImageFileToBase64(selectedCoverImage) : null, // Convert cover image to base64
            }

            setBooks((previousBooks) => [...previousBooks, renderedBook]); // Add the new book to the list
            
            setShowAddOverlay(false); // Close the overlay
        } else {
            console.log("Please fill in all required fields.");
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
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
                <DeletionConfirmationBox
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

            {/* Add Overlay */}
            {showAddOverlay && (
                <div className="add-overlay">
                    <div className="add-overlay-content">
                        <h1 id="add-overlay-title">Add your book here</h1>
                        <p>Please enter the book information</p>

                        {/* Input fields for book details */}
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

                        {/* File input for uploading content */}
                        <div className="file-input-container">
                            <label htmlFor="file-input" className="file-input-label">
                                Upload Content
                            </label>
                            <input
                                type="file"
                                id="file-input"
                                onChange={handleFileSelect}
                                accept=".txt"  // You can restrict the accepted file types
                                className="file-input-button"
                            />
                            
                            {selectedFile && (
                                <div className="file-name-display">
                                    {selectedFile.name}
                                </div>
                            )}
                        </div>

                        {/* File input for uploading cover image */}
                        <div className="file-input-container">
                            <label htmlFor="cover-image-input" className="file-input-label">
                                Upload Cover Image
                            </label>
                            <input
                                type="file"
                                id="cover-image-input"
                                onChange={handleCoverImageSelect}
                                accept="image/*" // Accept image file types
                                className="file-input-button"
                            />

                            {selectedCoverImage && (
                                <div className="file-name-display">
                                    {selectedCoverImage.name}
                                </div>
                            )}
                        </div>

                        <div className="add-overlay-buttons">
                            <button onClick={handleBookUpload}>Upload Book</button>
                            <button onClick={() => setShowAddOverlay(false)}>Close</button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
