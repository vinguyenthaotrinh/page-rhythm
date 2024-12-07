import IMAGES from "../images";
import Server from "../Server";
import "../styles/home-page-styles.css";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [books, setBooks] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch books on page load
        const fetchBooks = async () => {
            try {
                const server = await Server.getInstance();  // Get the server instance
                const randomBooks = await server.getAllBooksInRandomOrder();  // Fetch random books
                setBooks(randomBooks);  // Set the fetched books into the state

                //print the fetched books

                for (let i = 0; i < randomBooks.length; i++) {
                    console.log(randomBooks[i].image);
                }
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, []);
    
    const handleSearch = () => {
        // Implement search logic here
        // Filter books based on searchTerm and selectedGenre
    
        const filteredBooks = books.filter((book) => {
            if (selectedGenre === "All") {
                return book.title.toLowerCase().includes(searchTerm.toLowerCase());
            } else {
                return (
                    book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    book.genre === selectedGenre
                );
            }
        });

        setBooks(filteredBooks);
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
                    <div className="home-page-book-list-item" key={index}>
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
                        <div className="home-page-book-release-date">{book.releaseDate || "Unknown"}</div> {/* Show "Unknown" if releaseDate is null */}
                    </div>
                ))}
            </div>
        </div>
    )
}