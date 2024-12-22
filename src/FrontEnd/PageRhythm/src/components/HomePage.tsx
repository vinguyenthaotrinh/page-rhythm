import IMAGES from "../images";
import Server from "../Server";
import "../styles/home-page-styles.css";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [searchTerm, setSearchTerm]       =   useState("");
    const [selectedGenre, setSelectedGenre] =   useState("All");
    const [genres, setGenres]               =   useState<string[]>([
        "Science Fiction",
        "Fantasy",
        "Non-Fiction",
        "Mystery",
        "Romance",
        "Horror"
    ]);
    const [books, setBooks]                 =   useState<any[]>([]);
    const navigate                          =   useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const server        = await Server.getInstance();
                const randomBooks   = await server.getAllPublicBooksInRandomOrder();    // Fetch books in random order
                setBooks(randomBooks);                                                  // Set the fetched books into the state
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();

        document.body.style.overflowY = "hidden";

        return () => {
            // Re-enable global scrolling on component unmount
            document.body.style.overflowY = "auto";
        };
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const server = await Server.getInstance();
                const fetchedGenres = await server.getAllGenres();

                // Combine hardcoded genres and fetched genres, and remove duplicates
                const combinedGenres = new Set([...genres, ...fetchedGenres]);
                setGenres(Array.from(combinedGenres));
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchGenres();
    }, []);
    
    const handleSearch = async () => {
        try {
            const server = await Server.getInstance();

            const searchResults = await server.searchBooks(searchTerm, selectedGenre === "All" ? null : selectedGenre);

            setBooks(searchResults);

            console.log("Search results:", searchResults);
        } catch (error) {
            console.error("Error during search:", error);
        }
    };
    
    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
    };

    const handleBookClick = (bookID: string) => {
        navigate(`/book-details-page/${bookID}`);
    };

    return (
        <div id = "home-page">
            <NavigationBar />
            <div id="home-page-search-container">
                <div className="home-page-input-container">
                    <img
                        src         =   {IMAGES.SEARCH_ICON} 
                        alt         =   "Search Icon" 
                        className   =   "home-page-input-icon" 
                    />
                    <input
                        type        =   "text"
                        placeholder =   "Find Your Books"
                        value       =   {searchTerm}
                        onChange    =   {(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="home-page-select-container">
                    <img src={IMAGES.SLIDERS_ICON} alt="Genre Icon" className="home-page-select-icon" />
                    <select 
                        value       =   {selectedGenre} 
                        onChange    =   {handleGenreChange}
                    >
                        <option value="All">
                            All genres
                        </option>
                        {genres.map((genre) => (
                            <option 
                                key     =   {genre} 
                                value   =   {genre}
                            >
                                {genre}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="home-page-book-list-headers">
                <div 
                    className="home-page-book-list-header"
                    id = "home-page-book-list-header-title"
                >Title</div>
                <div className="home-page-book-list-header">Rating</div>
                <div className="home-page-book-list-header">Genre</div>
                <div className="home-page-book-list-header">Release Date</div>
            </div>

            <div className="home-page-book-list">
                {books.map((book, index) => (
                    <div 
                        className   =   "home-page-book-list-item" 
                        key         =   {index}
                        onClick     =   {() => handleBookClick(book.book_id)}
                    >
                        <div className="home-page-book-title">
                            <div className="home-page-book-cover">
                                <img 
                                    src={IMAGES.decodeBookCoverImage(book.image)} 
                                    alt={book.title} 
                                />
                            </div>
                            <div className="home-page-book-info">
                                <h3>{book.title || "Unknown"}</h3> {/* Show "Unknown" if title is null */}
                                <p>{book.author || "Unknown"}</p> {/* Show "Unknown" if author is null */}
                            </div>
                        </div>
                        <div className="home-page-book-rating">{book.rating || 5}</div> {/* Show "Unknown" if rating is null */}
                        <div className="home-page-book-genre">{book.genre || "Unknown"}</div> {/* Show "Unknown" if genre is null */}
                        <div className="home-page-book-release-date">{book.released_date || "Unknown"}</div> {/* Show "Unknown" if releaseDate is null */}
                    </div>
                ))}
            </div>
        </div>
    )
}