import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import "../styles/books-my-library-page-styles.css";
import { Link, useNavigate } from "react-router-dom";
import MyLibrarySectionBar from "./MyLibrarySectionBar";
import BookDeletionConfirmationBox from "./BookDeletionConfirmationBox";

interface AddBookOverlayProps {
    showAddOverlay:         boolean;
    setShowAddOverlay:      React.Dispatch<React.SetStateAction<boolean>>;
    selectedFile:           File | null;
    setSelectedFile:        React.Dispatch<React.SetStateAction<File | null>>;
    bookName:               string;
    setBookName:            React.Dispatch<React.SetStateAction<string>>;
    authorName:             string;
    setAuthorName:          React.Dispatch<React.SetStateAction<string>>;
    releaseDate:            string | null;
    setReleaseDate:         React.Dispatch<React.SetStateAction<string | null>>;
    genre:                  string | null;
    setGenre:               React.Dispatch<React.SetStateAction<string | null>>;
    summary:                string;
    setSummary:             React.Dispatch<React.SetStateAction<string>>;
    selectedCoverImage:     File | null;
    setSelectedCoverImage:  React.Dispatch<React.SetStateAction<File | null>>;
    handleFileSelect:       (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCoverImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBookUpload:       () => void;
}

const AddBookOverlay: React.FC<AddBookOverlayProps> = ({
    showAddOverlay,
    setShowAddOverlay,
    selectedFile,
    setSelectedFile,
    bookName,
    setBookName,
    authorName,
    setAuthorName,
    releaseDate,
    setReleaseDate,
    genre,
    setGenre,
    summary,
    setSummary,
    selectedCoverImage,
    setSelectedCoverImage,
    handleFileSelect,
    handleCoverImageSelect,
    handleBookUpload,
}) => {
    if (!showAddOverlay) return null;

    return (
        <div 
            className   =   "add-overlay"
        >
            <div 
                className   =   "add-overlay-content"
            >
                <h1 
                    className   =   "add-overlay-title"
                >
                    Upload your book here
                </h1>
                <p>
                    Please enter the book information
                </p>

                <input
                    type        =   "text"
                    placeholder =   "Book Name"
                    value       =   {bookName}
                    onChange    =   {(e) => setBookName(e.target.value)}
                />

                <input
                    type        =   "text"
                    placeholder =   "Author Name"
                    value       =   {authorName}
                    onChange    =   {(e) => setAuthorName(e.target.value)}
                />
                <input
                    type        =   "date"
                    placeholder =   "Release Date"
                    value       =   {releaseDate || ""}
                    onChange    =   {(e) => setReleaseDate(e.target.value)}
                />
                <input
                    type        =   "text"
                    placeholder =   "Genre (optional)"
                    value       =   {genre || ""}
                    onChange    =   {(e) => setGenre(e.target.value)}
                />
                <textarea
                    placeholder =   "Summary"
                    value       =   {summary}
                    onChange    =   {(e) => setSummary(e.target.value)}
                />

                <div 
                    className   =   "file-input-container"
                >
                    <label 
                        htmlFor     =   "file-input" 
                        className   =   "file-input-label"
                    >
                        Upload Content
                    </label>
                    <input
                        type        =   "file"
                        id          =   "file-input"
                        onChange    =   {handleFileSelect}
                        accept      =   ".txt"
                        className   =   "file-input-button"
                    />

                    {selectedFile && (
                        <div 
                            className   =   "file-name-display"
                        >
                            {selectedFile.name}
                        </div>
                    )}
                </div>

                <div 
                    className   =   "file-input-container"
                >
                    <label 
                        htmlFor     =   "cover-image-input" 
                        className   =   "file-input-label"
                    >
                        Upload Cover Image
                    </label>
                    <input
                        type        =   "file"
                        id          =   "cover-image-input"
                        onChange    =   {handleCoverImageSelect}
                        accept      =   "image/*"
                        className   =   "file-input-button"
                    />

                    {selectedCoverImage && (
                        <div className="file-name-display">
                            {selectedCoverImage.name}
                        </div>
                    )}
                </div>

                <div 
                    className   =   "add-overlay-buttons"
                >
                    <button 
                        onClick =   {handleBookUpload}
                    >
                        Upload Book
                    </button>
                    <button 
                        onClick =   {() => setShowAddOverlay(false)}
                    >
                        Close
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
    const [selectedCoverImage, setSelectedCoverImage]   = useState<File | null>(null);

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
            image: selectedCoverImage || selectedBook?.image,   // Keep old image if not updating
        };
        handleEditBook(updatedBook);                            // Pass the updated book data
        setShowEditOverlay(false);                              // Close the overlay
    };

    if (!showEditOverlay || !selectedBook) 
        return null;

    return (
        <div 
            className   =   "add-overlay"
        >
            <div 
                className   =   "add-overlay-content"
            >
                <h1 
                    className   =   "add-overlay-title"
                >
                    Edit Book Information
                </h1>
                <p>
                    Edit the book details below
                </p>

                <input
                    type        =   "text"
                    placeholder =   "Book Name"
                    value       =   {bookName}
                    onChange    =   {(e) => setBookName(e.target.value)}
                />

                <input
                    type        =   "text"
                    placeholder =   "Author Name"
                    value       =   {authorName}
                    onChange    =   {(e) => setAuthorName(e.target.value)}
                />
                <input
                    type        =   "date"
                    placeholder =   "Release Date"
                    value       =   {releaseDate || ""}
                    onChange    =   {(e) => setReleaseDate(e.target.value)}
                />
                <input
                    type        =   "text"
                    placeholder =   "Genre (optional)"
                    value       =   {genre || ""}
                    onChange    =   {(e) => setGenre(e.target.value)}
                />
                <textarea
                    placeholder =   "Summary"
                    value       =   {summary}
                    onChange    =   {(e) => setSummary(e.target.value)}
                />

                <div 
                    className   =   "file-input-container"
                >
                    <label 
                        htmlFor     =   "cover-image-input" 
                        className   =   "file-input-label"
                    >
                        Upload Cover Image (optional)
                    </label>
                    <input
                        type        =   "file"
                        id          =   "cover-image-input"
                        onChange    =   {(e) => setSelectedCoverImage(e.target.files?.[0] || null)}
                        accept      =   "image/*"
                        className   =   "file-input-button"
                    />

                    {selectedCoverImage && (
                        <div 
                            className   =   "file-name-display"
                        >
                            {selectedCoverImage.name}
                        </div>
                    )}
                </div>

                <div 
                    className   =   "add-overlay-buttons"
                >
                    <button 
                        onClick =   {handleBookEdit}
                    >
                        Save Changes
                    </button>
                    <button 
                        onClick =   {() => setShowEditOverlay(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

function LoadingText() {
    return (
        <p
            id  =   "books-my-library-page-loading-text"
        >
            Loading...
        </p>
    );
}

function NoBookText() {
    return (
        <p
            id  =   "books-my-library-page-loading-text"
        >
            You currently have no books.
        </p>
    );
}

export default function BooksMyLibraryPage() {
    const [books, setBooks]                                         = useState<any[]>([]);
    const [loading, setLoading]                                     = useState(true);
    const [showDeletionConfirmation, setShowDeletionConfirmation]   = useState(false);                  // Confirmation box visibility
    const [bookToDelete, setBookToDelete]                           = useState<any | null>(null);       // Track the selected book for deletion
    const [showAddOverlay, setShowAddOverlay]                       = useState(false);
    const [selectedFile, setSelectedFile]                           = useState<File | null>(null);      // Track the selected file for upload
    const [bookName, setBookName]                                   = useState("");                     // Book name input
    const [authorName, setAuthorName]                               = useState("");                     // Author name input
    const [releaseDate, setReleaseDate]                             = useState<string | null>("");      // Release date input
    const [genre, setGenre]                                         = useState<string | null>("");      // Genre input
    const [summary, setSummary]                                     = useState("");                     // Summary input
    const [selectedCoverImage, setSelectedCoverImage]               = useState<File | null>(null);      // Track the cover image file
    const [showEditOverlay, setShowEditOverlay]                     = useState(false);
    const [selectedBook, setSelectedBook]                           = useState<any | null>(null);
    const navigate                                                  = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const server    = await Server.getInstance();
                const response  = await server.getUserUploadedBooks();
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
    
            const reader = new FileReader();
            reader.onloadend = () => {
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleBookUpload = async () => {
        if (selectedFile && bookName && authorName) {
            
            const book = {
                title: bookName,
                author: authorName,
                summary,
                genre,
                content: selectedFile,
                image: selectedCoverImage || null, // Optional cover image
            };

            console.log("Uploading book with details:", book);

            const server = await Server.getInstance();

            await server.uploadBook(book);

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
            reader.readAsDataURL(file);
        }
    };

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
        <div 
            id  =   "books-my-library-page"
        >
            <NavigationBar />
            <div 
                id  =   "books-my-library-page-container"
            >
                <MyLibrarySectionBar 
                    currentOption   =   "books" 
                />
                <div 
                    id  =   "books-my-library-page-content"
                >
                    <button
                        id      =   "books-my-library-page-add-book-button"
                        onClick =   {handleAddClick}
                    >
                        Add
                        <img
                            src         =   {IMAGES.ADD_ICON}
                            alt         =   "Add Icon"
                            className   =   "books-my-library-page-add-icon"
                        />
                    </button>

                    <h1 id = "books-my-library-page-title">
                        My Library
                    </h1>

                    {/* Scrollable section for books */}
                    <div 
                        id  =   "books-my-library-page-books-list-container"
                    >
                        {loading ? (<LoadingText />) : (books.length === 0 ? (<NoBookText />) :
                            <div 
                                id  =   "books-my-library-page-books-grid"
                            >
                                {books.map((book, index) => (
                                    <div 
                                        key         =   {index} 
                                        className   =   "books-my-library-page-book-item"
                                    >
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
                                        <div 
                                            className   =   "book-item-right-column"
                                        >
                                            <p 
                                                className   =   "book-item-title"
                                            >
                                                {book.title}
                                            </p>
                                            <p 
                                                className   =   "book-item-author"
                                            >
                                                Author: {book.author}
                                            </p>
                                            <p 
                                                className   =   "book-item-release-date"
                                            >
                                                Release Date: {book.released_date || "Unknown"}
                                            </p>
                                            <div 
                                                className   =   "book-item-buttons"
                                            >
                                                <button 
                                                    className       =   "book-item-edit-button"
                                                    onClick         =   {() => handleEditClick(book)}
                                                >
                                                    Edit
                                                    <img
                                                        src         =   {IMAGES.WHITE_PENCIL_ICON}
                                                        alt         =   "Edit Icon"
                                                        className   =   "book-item-button-icon"
                                                    />
                                                </button>
                                                <button
                                                    className   =   "book-item-delete-button"
                                                    onClick     =   {() => handleDeleteClick(book)}
                                                >
                                                    Delete
                                                    <div 
                                                        className   =   "book-item-button-icon"
                                                    >
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
                        )}
                    </div>
                </div>
            </div>

            <BookDeletionConfirmationBox
                showDeletionConfirmation    =   {showDeletionConfirmation}
                onConfirm                   =   {handleConfirmDelete}
                onCancel                    =   {handleCancelDelete}
            />

            <AddBookOverlay
                showAddOverlay          =   {showAddOverlay}
                setShowAddOverlay       =   {setShowAddOverlay}
                selectedFile            =   {selectedFile}
                setSelectedFile         =   {setSelectedFile}
                bookName                =   {bookName}
                setBookName             =   {setBookName}
                authorName              =   {authorName}
                setAuthorName           =   {setAuthorName}
                releaseDate             =   {releaseDate}
                setReleaseDate          =   {setReleaseDate}
                genre                   =   {genre}
                setGenre                =   {setGenre}
                summary                 =   {summary}
                setSummary              =   {setSummary}
                selectedCoverImage      =   {selectedCoverImage}
                setSelectedCoverImage   =   {setSelectedCoverImage}
                handleFileSelect        =   {handleFileSelect}
                handleCoverImageSelect  =   {handleCoverImageSelect}
                handleBookUpload        =   {handleBookUpload}
            />

            <EditBookOverlay
                showEditOverlay     =   {showEditOverlay}
                setShowEditOverlay  =   {setShowEditOverlay}
                selectedBook        =   {selectedBook}
                setSelectedBook     =   {setSelectedBook}
                handleEditBook      =   {handleEditBook}
            />
        </div>
    );
}
