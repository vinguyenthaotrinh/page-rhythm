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

    const decodeBookCover = (bookCover: string | null) => {
        if (!bookCover) {
            return IMAGES.DEFAULT_BOOK_COVER;
        }
        return `data:image/jpeg;base64,${bookCover}`;
    }

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
                                    <div 
                                        key={index} 
                                        className="books-my-library-page-book-item"
                                    >
                                        <img 
                                            src={decodeBookCover(book.image)} 
                                            alt={book.title} 
                                            className="books-my-library-page-book-cover" 
                                        />
                                        <p 
                                            className="books-my-library-page-book-title"
                                        >{book.title}</p>
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