import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import ProfileSectionBar from "./ProfileSectionBar";
import { Link, useNavigate } from "react-router-dom";
import "../styles/statistics-profile-page-styles.css";
import BookDeletionConfirmationBox from "./BookDeletionConfirmationBox";

interface UpdateStatusOverlayProps {
    showUpdateStatusOverlay:        boolean;
    setShowUpdateStatusOverlay:     (show: boolean) => void;
    selectedBook:                   any | null;
    setSelectedBook:                (book: any | null) => void;
    handleUpdateStatusBook:         (book: any) => void;
}

const UpdateStatusOverlay: React.FC<UpdateStatusOverlayProps> = ({
    showUpdateStatusOverlay,
    setShowUpdateStatusOverlay,
    selectedBook,
    setSelectedBook,
    handleUpdateStatusBook,
}) => {
    if (!showUpdateStatusOverlay || !selectedBook) return null;

    return <p>To Be Continued</p>
};

function LoadingText() {
    return (
        <p
            id = "statistics-profile-page-loading-text"
        >
            Loading...
        </p>
    );
}

function NoBookText() {
    return (
        <p
            id = "statistics-profile-page-loading-text"
        >
            There is no book to display.
        </p>
    );
}

export default function StatisticsProfilePage() {
    const [books, setBooks]                                             = useState<any[]>([]);              // Books data state
    const [loading, setLoading]                                         = useState(true);                   // Loading state
    const [showDeletionConfirmation, setShowDeletionConfirmation]       = useState(false);                  // Confirmation box visibility
    const [bookToDelete, setBookToDelete]                               = useState<any | null>(null);
    const [selectedBook, setSelectedBook]                               = useState<any | null>(null);       // Selected book for update status
    const [showUpdateStatusOverlay, setShowUpdateStatusOverlay]         = useState(false);                  // Update status overlay visibility
    const navigate                                                      = useNavigate();                    // Navigation hook

    const handleUpdateStatusClick = (book: any) => {
        setSelectedBook(book);
        setShowUpdateStatusOverlay(true); 
    };
    
    const handleUpdateStatusBook = async (updatedBook: any) => {
        try {
            const server = await Server.getInstance();
            //await server.updateBook(updatedBook);
            setBooks(books.map((book) =>
                book.book_id === updatedBook.book_id ? updatedBook : book
            ));
            setSelectedBook(null);
            setShowUpdateStatusOverlay(false);
        } catch (error) {
            console.error("Error updating book:", error);
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
                await server.deleteTrackedReadingProgress(bookToDelete.book_id); 
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

    const formatProgressStatus = (status: string, currentPage: number): string => {

        console.log(status);

        if (status == "not_started") 
            return "Not started";

        if (status == "in_progress")
            return `In progress (page ${currentPage})`;

        if (status == "finished")
            return "Finished";

        return "Unknown";
    }

    const formatMostRecentUpdateDate = (datetime: string | null): string => {
        if (datetime === null)
            return "No updates yet";

        return datetime.split("T")[0];
    }

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
                    <div id="statistics-profile-page-books-list-container">
                        {loading ? (<LoadingText />) : (books.length === 0 ? (<NoBookText />) :
                            <div id="statistics-profile-page-books-grid">
                                {books.map((book, index) => (
                                    <div key={index} className="statistics-profile-page-book-item">
                                        <div className="statistics-book-item-left-column">
                                            <img
                                                src={IMAGES.decodeBookCoverImage(book.image)}
                                                alt={book.title}
                                                onClick = {() => navigate(`/book-details-page/${book.book_id}`)}
                                                className="book-item-cover"
                                            />
                                        </div>
                                        <div className="statistics-book-item-right-column">
                                            <p className="statistics-book-item-title">{book.title}</p>
                                            <p className="statistics-book-item-author">Author: {book.author}</p>
                                            <p className="statistics-book-item-release-date">
                                                Release Date: {book.released_date || "Unknown"}
                                            </p>
                                            <p className="statistics-book-item-most-recent-update">
                                                Most Recent Update: {formatMostRecentUpdateDate(book.progress.most_recent_update_date)}
                                            </p>
                                            <p className="statistics-book-item-progress-status">
                                                Status: {formatProgressStatus(book.progress.status, book.progress.page_number)}
                                            </p>
                                            <div className="statistics-book-item-buttons">
                                                <button 
                                                    className="statistics-book-item-edit-button"
                                                    onClick={() => handleUpdateStatusClick(book)}
                                                >
                                                    Update Status
                                                    <img
                                                        src={IMAGES.WHITE_PENCIL_ICON}
                                                        alt="Edit Icon"
                                                        className="statistics-book-item-button-icon"
                                                    />
                                                </button>
                                                <button
                                                    className="statistics-book-item-delete-button"
                                                    onClick={() => handleDeleteClick(book)}
                                                >
                                                    Delete
                                                    <div className="statistics-book-item-button-icon">
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

            <BookDeletionConfirmationBox
                title                       =   "Delete the tracked progress"
                message                     =   "Are you sure you want to delete the tracked progress of this book?"
                showDeletionConfirmation    =   {showDeletionConfirmation}
                onConfirm                   =   {handleConfirmDelete}
                onCancel                    =   {handleCancelDelete}
            />

            <UpdateStatusOverlay
                showUpdateStatusOverlay     =   {showUpdateStatusOverlay}
                setShowUpdateStatusOverlay  =   {setShowUpdateStatusOverlay}
                selectedBook                =   {selectedBook}
                setSelectedBook             =   {setSelectedBook}
                handleUpdateStatusBook      =   {handleUpdateStatusBook}
            />
        </div>
    );
}
