import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/voices-my-library-page-styles.css";
import { Link, useNavigate } from "react-router-dom";
import MyLibrarySectionBar from "./MyLibrarySectionBar";
import React, { useState, useRef, useEffect } from "react";

interface AddSampleAudioFileOverlayProps {
    showAddOverlay: boolean;
    setShowAddOverlay: React.Dispatch<React.SetStateAction<boolean>>;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    fileName: string;
    setFileName: React.Dispatch<React.SetStateAction<string>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSampleAudioFileUpload: () => void;
}

const AddSampleAudioFileOverlay: React.FC<AddSampleAudioFileOverlayProps> = ({
    showAddOverlay,
    setShowAddOverlay,
    selectedFile,
    setSelectedFile,
    fileName,
    setFileName,
    description,
    setDescription,
    handleFileSelect,
    handleSampleAudioFileUpload,
}) => {
    if (!showAddOverlay) return null;

    return (
        <div className="add-overlay">
            <div className="add-overlay-content">
                <h1 id="add-overlay-title">Upload your sample audio file here</h1>
                <p>Please enter the file information</p>

                <input
                    type="text"
                    placeholder="File Name"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="file-input-container">
                    <label htmlFor="file-input" className="file-input-label">
                        Upload File
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        onChange={handleFileSelect}
                        accept=".m4a, .mp3, .wav"
                        className="file-input-button"
                    />

                    {selectedFile && (
                        <div className="file-name-display">
                            {selectedFile.name}
                        </div>
                    )}
                </div>

                <div className="add-overlay-buttons">
                    <button onClick={handleSampleAudioFileUpload}>Upload File</button>
                    <button onClick={() => setShowAddOverlay(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default function VoicesMyLibraryPage() {
    const [showAddOverlay, setShowAddOverlay] = useState(false);            // State for Add Overlay
    const [records, setRecords] = useState<any[]>([]);                      // Records will be fetched
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);  // Track currently playing audio
    const [audioTime, setAudioTime] = useState(0);                          // Track current time of audio
    const audioRefs = useRef<Record<number, HTMLAudioElement>>({});         // Refs for each audio file
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [description, setDescription] = useState("");
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
    
    const handleSampleAudioFileUpload = async () => {
        if (selectedFile && fileName) {
            // Prepare the book object
            const book = {
                file_name: fileName,
                description: description,
                content: selectedFile,
                image: selectedCoverImage || null, // Optional cover image
            };

            console.log("Uploading book with details:", book);

            const server = await Server.getInstance();

            //await server.uploadBook(book);

            // Update UI after successful upload
            console.log("Book uploaded successfully!");

            const renderedBook = {
                file_name: fileName,
                description: description,
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

            <AddSampleAudioFileOverlay
                showAddOverlay={showAddOverlay}
                setShowAddOverlay={setShowAddOverlay}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                fileName={fileName}
                setFileName={setFileName}
                description={description}
                setDescription={setDescription}
                handleFileSelect={handleFileSelect}
                handleSampleAudioFileUpload={handleSampleAudioFileUpload}
            />
        </div>
    );
}
