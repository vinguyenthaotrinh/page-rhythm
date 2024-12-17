import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/voices-my-library-page-styles.css";
import { Link, useNavigate } from "react-router-dom";
import MyLibrarySectionBar from "./MyLibrarySectionBar";
import React, { useState, useRef, useEffect } from "react";

interface AddBookOverlayProps {
    showAddOverlay: boolean;
    setShowAddOverlay: React.Dispatch<React.SetStateAction<boolean>>;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    bookName: string;
    setBookName: React.Dispatch<React.SetStateAction<string>>;
    authorName: string;
    setAuthorName: React.Dispatch<React.SetStateAction<string>>;
    releaseDate: string | null;
    setReleaseDate: React.Dispatch<React.SetStateAction<string | null>>;
    genre: string | null;
    setGenre: React.Dispatch<React.SetStateAction<string | null>>;
    summary: string;
    setSummary: React.Dispatch<React.SetStateAction<string>>;
    selectedCoverImage: File | null;
    setSelectedCoverImage: React.Dispatch<React.SetStateAction<File | null>>;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCoverImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBookUpload: () => void;
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
        <div className="add-overlay">
            <div className="add-overlay-content">
                <h1 id="add-overlay-title">Upload your book here</h1>
                <p>Please enter the book information</p>

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
                    <label htmlFor="file-input" className="file-input-label">
                        Upload Content
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        onChange={handleFileSelect}
                        accept=".txt"
                        className="file-input-button"
                    />

                    {selectedFile && (
                        <div className="file-name-display">
                            {selectedFile.name}
                        </div>
                    )}
                </div>

                <div className="file-input-container">
                    <label htmlFor="cover-image-input" className="file-input-label">
                        Upload Cover Image
                    </label>
                    <input
                        type="file"
                        id="cover-image-input"
                        onChange={handleCoverImageSelect}
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
                    <button onClick={handleBookUpload}>Upload Book</button>
                    <button onClick={() => setShowAddOverlay(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default function VoicesMyLibraryPage() {
    const [showAddOverlay, setShowAddOverlay] = useState(false); // State for Add Overlay
    const [records, setRecords] = useState<any[]>([]); // Records will be fetched
    const [playingIndex, setPlayingIndex] = useState<number | null>(null); // Track currently playing audio
    const [audioTime, setAudioTime] = useState(0); // Track current time of audio
    const audioRefs = useRef<Record<number, HTMLAudioElement>>({}); // Refs for each audio file

    // State for AddBookOverlay
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [bookName, setBookName] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [releaseDate, setReleaseDate] = useState<string | null>(null);
    const [genre, setGenre] = useState<string | null>(null);
    const [summary, setSummary] = useState("");
    const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
    
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

            const server = await Server.getInstance();

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

            //setBooks((previousBooks) => [...previousBooks, renderedBook]); // Add the new book to the list
            
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

    // Fetch user-uploaded sample audio files on component mount
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const server = await Server.getInstance();
                const fetchedRecords = await server.getUserUploadedSampleAudioFiles();
                console.log("Fetched records:", fetchedRecords);
                setRecords(fetchedRecords);
            } catch (error) {
                console.error("Error fetching uploaded audio files:", error);
            }
        };

        fetchRecords();
    }, []);

    const handleAddClick = () => {
        setShowAddOverlay(true); // Show the overlay
    };

    const handlePlayPause = (index: number) => {
        const audio = audioRefs.current[index];
        if (audio.paused) {
            audio.play();
            setPlayingIndex(index);
        } else {
            audio.pause();
            setPlayingIndex(null);
        }
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const audio = audioRefs.current[index];
        if (audio && audio.duration) {
            const seekTime = (event.target.valueAsNumber / 100) * audio.duration;
            audio.currentTime = seekTime;
            setAudioTime(seekTime);
        }
    };

    const handleDelete = (id: number) => {
        const updatedRecords = records.filter((record) => record.id !== id);
        setRecords(updatedRecords);
    };

    const handleEdit = (id: number) => {
        console.log("Edit record", id);
    };

    return (
        <div id="voices-my-library-page">
            <NavigationBar />
            <div id="voices-my-library-page-container">
                <MyLibrarySectionBar currentOption="voices" />
                <div id="voices-my-library-page-content">
                    <button
                        id="voices-my-library-page-add-book-button"
                        onClick={handleAddClick}
                    >
                        Add
                        <img
                            src={IMAGES.ADD_ICON}
                            alt="Add Icon"
                            className="voices-my-library-page-add-icon"
                        />
                    </button>

                    {/* Scrollable section for records */}
                    <div id="voices-my-library-page-record-list-container">
                        {records.map((record, index) => (
                            <div key={record.id} className="record-item">
                                <div className="record-header">
                                    <span className="audio-name">{record.file_name}</span>
                                </div>

                                <div className="record-body">
                                    {/* Left Column */}
                                    <div className="record-left-column">
                                        <audio
                                            ref={(el) => (audioRefs.current[index] = el!)}
                                            src={record.file_url}
                                            onTimeUpdate={() =>
                                                setAudioTime(audioRefs.current[index].currentTime)
                                            }
                                        />
                                        <button
                                            className="play-pause-btn"
                                            onClick={() => handlePlayPause(index)}
                                        >
                                            {playingIndex === index ? "Pause" : "Play"}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={(audioTime / audioRefs.current[index]?.duration) * 100 || 0}
                                            onChange={(event) => handleSeek(event, index)}
                                            className="audio-slider"
                                        />
                                    </div>

                                    {/* Right Column */}
                                    <div className="record-right-column">
                                        <button
                                            className="book-item-edit-button"
                                            onClick={() => handleEdit(record.id)}
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
                                            onClick={() => handleDelete(record.id)}
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
                </div>
            </div>

            {/* Render the AddBookOverlay */}
            <AddBookOverlay
                showAddOverlay={showAddOverlay}
                setShowAddOverlay={setShowAddOverlay}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                bookName={bookName}
                setBookName={setBookName}
                authorName={authorName}
                setAuthorName={setAuthorName}
                releaseDate={releaseDate}
                setReleaseDate={setReleaseDate}
                genre={genre}
                setGenre={setGenre}
                summary={summary}
                setSummary={setSummary}
                selectedCoverImage={selectedCoverImage}
                setSelectedCoverImage={setSelectedCoverImage}
                handleFileSelect={handleFileSelect}
                handleCoverImageSelect={handleCoverImageSelect}
                handleBookUpload={handleBookUpload}
            />
        </div>
    );
}
