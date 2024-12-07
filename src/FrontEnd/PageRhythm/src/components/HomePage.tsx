import IMAGES from "../images";
import Server from "../Server";
import "../styles/home-page-styles.css";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [books, setBooks] = useState([
        {
          title: "There's a Million Books",
          author: "Author Name",
          genre: "Fiction",
          releaseDate: "01/01/2023",
        },
        {
          title: "There's a Million Books",
          author: "Author Name",
          genre: "Non-Fiction",
          releaseDate: "02/15/2022",
        },
        // Add more book data here
    ]);
    
    const navigate = useNavigate();
    
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

    return (
        <div id = "home-page">
            <NavigationBar />
            <div id="home-page-content">
                <div id="home-page-search-container">
                    <input
                        type="text"
                        placeholder="Find Your Books"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={selectedGenre} onChange={handleGenreChange}>
                        <option value="All">All</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Romance">Romance</option>
                        <option value="Horror">Horror</option>
                    </select>
                    <button onClick={handleSearch}>Search</button>
                    </div>
                </div>
        </div>
    )
}