import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import AdminSectionBar from "./AdminSectionBar";
import "../styles/accounts-admin-page-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoadingText() {
    return (
        <p
            id = "books-admin-page-loading-text"
        >
            Loading...
        </p>
    );
}

function NoUserAccountText() {
    return (
        <p
            id = "books-my-library-page-loading-text"
        >
            There is no user account to display.
        </p>
    );
}

export default function AccountsAdminPage() {
    const [books, setBooks]                                             = useState<any[]>([]);              // Books data state
    const [userAccounts, setUserAccounts]                               = useState<any[]>([]);              // User accounts data state
    const [loading, setLoading]                                         = useState(true);                   // Loading state
    const navigate                                                      = useNavigate();

    useEffect(() => {
        const fetchUserAccounts = async () => {
            try {
                setLoading(true);
                const server = await Server.getInstance();
                const response = await server.getAllUserAccounts();
                setUserAccounts(response);
            } catch (error) {
                console.error("Error fetching user accounts:", error);
            } finally {
                setLoading(false);
                console.log(userAccounts);
            }
        }

        fetchUserAccounts();
    }, []);

    return (
        <div id="books-admin-page">
            <NavigationBar />

            <div id="books-admin-page-container">
                <AdminSectionBar currentOption="accounts" />
                <div id="books-admin-page-content">
                    
                    {/* Scrollable section for books */}
                    <div id="books-admin-page-books-list-container">
                        {loading ? (<LoadingText />) : (books.length === 0 ? (<NoUserAccountText />) : 
                            (
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
                                                        className="book-item-visibility-button"
                                                    >
                                                        {book.hidden ? "Unhide" : "Hide"}
                                                        <img
                                                            src={
                                                                book.hidden
                                                                    ? IMAGES.EYE_OPEN_ICON
                                                                    : IMAGES.EYE_CLOSED_ICON
                                                            }
                                                            alt="Visibility Icon"
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
                            )
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
