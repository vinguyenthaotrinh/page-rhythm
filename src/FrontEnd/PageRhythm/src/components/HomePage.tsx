import IMAGES from "../images";
import Server from "../Server";
import "../styles/home-page-styles.css";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [genres, setGenres] = useState<string[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch books on page load
        const fetchBooks = async () => {
            try {
                const server = await Server.getInstance();  // Get the server instance
                const randomBooks = await server.getAllBooksInRandomOrder();  // Fetch random books
                setBooks(randomBooks);  // Set the fetched books into the state
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const server = await Server.getInstance();
                const genresList = await server.getAllGenres();
                setGenres(genresList);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchGenres();
    }, []);
    
    const handleSearch = async () => {
        try {
            const server = await Server.getInstance();  // Get the server instance

            // Call the searchBooks method with the search term and selected genre
            const searchResults = await server.searchBooks(searchTerm, selectedGenre === "All" ? null : selectedGenre);

            // Set the state with the search results
            setBooks(searchResults);

            // Optionally, you can log the results to verify
            console.log("Search results:", searchResults);
        } catch (error) {
            console.error("Error during search:", error);
        }
    };
    
    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
    };

    const decodeBookCover = (bookCover: string | null) => {
        if (!bookCover) {
            return IMAGES.DEFAULT_BOOK_COVER;
        }
        return `data:image/jpeg;base64,${bookCover}`;
    }

    const handleBookClick = (bookID: string) => {
        navigate(`/book-details-page/${bookID}`);  // Redirect to the book details page
    };

    return (
        <div id = "home-page">
            <NavigationBar />
            <div id="home-page-search-container">
                <div className="home-page-input-container">
                    <img src={IMAGES.SEARCH_ICON} alt="Search Icon" className="home-page-input-icon" />
                    <input
                        type="text"
                        placeholder="Find Your Books"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="home-page-select-container">
                    <img src={IMAGES.SLIDERS_ICON} alt="Genre Icon" className="home-page-select-icon" />
                    <select value={selectedGenre} onChange={handleGenreChange}>
                        <option value="All">All genres</option>
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Romance">Romance</option>
                        <option value="Horror">Horror</option>
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
                        className="home-page-book-list-item" 
                        key={index}
                        onClick={() => handleBookClick(book.book_id)}  // Redirect to book details page on click
                    >
                        <div className="home-page-book-title">
                            <div className="home-page-book-cover">
                                <img 
                                    src={decodeBookCover(book.image)} 
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