import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/voices-my-library-page-styles.css";
import { Link, useNavigate } from "react-router-dom";
import MyLibrarySectionBar from "./MyLibrarySectionBar";
import React, { useState, useRef, useEffect } from "react";
import BookDeletionConfirmationBox from "./BookDeletionConfirmationBox";

interface AddSampleAudioFileOverlayProps {
    showAddOverlay:                 boolean;
    setShowAddOverlay:              React.Dispatch<React.SetStateAction<boolean>>;
    selectedFile:                   File | null;
    setSelectedFile:                React.Dispatch<React.SetStateAction<File | null>>;
    fileName:                       string;
    setFileName:                    React.Dispatch<React.SetStateAction<string>>;
    description:                    string;
    setDescription:                 React.Dispatch<React.SetStateAction<string>>;
    handleFileSelect:               (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSampleAudioFileUpload:    () => void;
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
    const [errorMessage, setErrorMessage]               =   useState<string | null>(null);
    const [isAddButtonDisabled, setIsAddButtonDisabled] =   useState(false);

    useEffect(() => {
        const validateAudioDuration = async () => {
            if (selectedFile) {
                const audio = new Audio(URL.createObjectURL(selectedFile));

                const timeout = setTimeout(() => {
                    if (Number.isNaN(audio.duration) || audio.duration === 0) {
                        setErrorMessage("The audio file is invalid.");
                        setIsAddButtonDisabled(true);
                    }
                }, 12000);

                audio.onloadedmetadata = () => {
                    clearTimeout(timeout);

                    if (audio.duration > 60) {
                        setErrorMessage("The audio file is longer than 60 seconds.");
                        setIsAddButtonDisabled(true);
                    } else {
                        setErrorMessage(null);
                        setIsAddButtonDisabled(false);
                    }
                };

                audio.onerror = () => {
                    clearTimeout(timeout);
                    setErrorMessage("The audio file is invalid.");
                    setIsAddButtonDisabled(true);
                };
            } else {
                setErrorMessage(null);
                setIsAddButtonDisabled(false);
            }
        };

        validateAudioDuration();
    }, [selectedFile]);

    if (!showAddOverlay) 
        return null;

    return (
        <div 
            className   =   "add-overlay"
        >
            <div 
                className  =    "add-overlay-content"
            >
                <h1 
                    className   =   "add-overlay-title"
                >
                    Upload your sample audio file here
                </h1>
                <p>
                    Please enter the file information
                </p>

                <input
                    type        =   "text"
                    placeholder =   "File Name"
                    value       =   {fileName}
                    onChange    =   {(e) => setFileName(e.target.value)}
                />

                <textarea
                    placeholder =   "Description"
                    value       =   {description}
                    onChange    =   {(e) => setDescription(e.target.value)}
                />

                <div 
                    className   =   "file-input-container"
                >
                    <label 
                        htmlFor     =   "file-input" 
                        className   =   "file-input-label"
                    >
                        Upload File
                    </label>
                    <input
                        type        =   "file"
                        id          =   "file-input"
                        onChange    =   {handleFileSelect}
                        accept      =   ".m4a, .mp3, .wav"
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

                {errorMessage && (
                    <div 
                        className   =   "voices-my-library-page-add-overlay-error-message" 
                        style       =   {{ color: "red" }}
                    >
                        {errorMessage}
                    </div>
                )}

                <div 
                    className   =   "add-overlay-buttons"
                >
                    <button 
                        onClick     =   {handleSampleAudioFileUpload}
                        disabled    =   {isAddButtonDisabled}
                    >     
                        Add
                    </button>
                    <button 
                        onClick     =   {() => setShowAddOverlay(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

interface EditSampleAudioFileOverlayProps {
    showEditOverlay:                boolean;
    setShowEditOverlay:             React.Dispatch<React.SetStateAction<boolean>>;
    selectedRecord:                 any | null;
    setSelectedRecord:              React.Dispatch<React.SetStateAction<any | null>>;
    handleEditRecord:               (record: any) => void;
}

const EditSampleAudioFileOverlay: React.FC<EditSampleAudioFileOverlayProps> = ({
    showEditOverlay,
    setShowEditOverlay,
    selectedRecord,
    setSelectedRecord,
    handleEditRecord,
}) => {
    const [fileName, setFileName]       = useState(selectedRecord?.file_name || "");
    const [description, setDescription] = useState(selectedRecord?.description || "");

    const handleEditClick = () => {
        if (selectedRecord) {
            handleEditRecord({
                ...selectedRecord,
                file_name: fileName,
                description: description,
            });
        }
    };

    if (!showEditOverlay) return null;

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
                    Edit your sample audio file
                </h1>
                <p>
                    Please enter the updated file information
                </p>

                <input
                    type        =   "text"
                    placeholder =   "File Name"
                    value       =   {fileName}
                    onChange    =   {(e) => setFileName(e.target.value)}
                />

                <textarea
                    placeholder =   "Description"
                    value       =   {description}
                    onChange    =   {(e) => setDescription(e.target.value)}
                />

                <div 
                    className   =   "add-overlay-buttons"
                >
                    <button 
                        onClick =   {handleEditClick}
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

function NoVoiceText() {
    return (
        <p
            id  =   "books-my-library-page-loading-text"
        >
            You currently have no sample audio files.
        </p>
    );
}

export default function VoicesMyLibraryPage() {
    const [showAddOverlay, setShowAddOverlay]                       = useState(false);
    const [records, setRecords]                                     = useState<any[]>([]);                              // Records will be fetched
    const [playingIndex, setPlayingIndex]                           = useState<number | null>(null);                    // Track currently playing audio
    const [audioTimes, setAudioTimes]                               = useState<Record<number, number>>({});             // Track current time for each audio
    const audioRefs                                                 = useRef<Record<number, HTMLAudioElement>>({});     // Refs for each audio file
    const [selectedFile, setSelectedFile]                           = useState<File | null>(null);
    const [fileName, setFileName]                                   = useState("");
    const [description, setDescription]                             = useState("");
    const [recordToDelete, setRecordToDelete]                       = useState<any | null>(null);
    const [showDeletionConfirmation, setShowDeletionConfirmation]   = useState(false);
    const [selectedRecord, setSelectedRecord]                       = useState<any | null>(null);
    const [showEditOverlay, setShowEditOverlay]                     = useState(false);
    const [loading, setLoading]                                     = useState(true);
    
    const handleSampleAudioFileUpload = async () => {
        if (selectedFile && fileName) {
            
            const record = {
                file_name:      fileName,
                description:    description,
                content:        selectedFile
            };

            try {
                const server = await Server.getInstance();
    
                // Upload the file and receive the full record including sample_audio_file_id
                const uploadedRecord = await server.uploadSampleAudioFile(record);
    
                // Update the state with the new record containing sample_audio_file_id
                setRecords([...records, uploadedRecord]);
    
                setShowAddOverlay(false); // Close the overlay
                setSelectedFile(null);    // Clear selected file
                setFileName("");          // Clear file name
                setDescription("");       // Clear description
            } catch (error) {
                console.error("Error uploading audio file:", error);
            }
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

            reader.onerror = (error) => {
                console.error("Error reading the file:", error);
            };

            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                const server            = await Server.getInstance();
                const fetchedRecords    = await server.getUserUploadedSampleAudioFiles();
                setRecords(fetchedRecords);
            } catch (error) {
                console.error("Error fetching uploaded audio files:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    const handleAddClick = () => {
        setShowAddOverlay(true); // Show the overlay
    };

    const handlePlayPause = (index: number) => {
        const audio = audioRefs.current[index];

        if (playingIndex !== null && playingIndex !== index) {
            const currentAudio = audioRefs.current[playingIndex];
            currentAudio.pause();
            currentAudio.currentTime = 0; // Reset to 00:00
            setAudioTimes((prev) => ({
                ...prev,
                [playingIndex]: 0, // Reset current time for the paused audio
            }));
        }

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

            // Update the specific audio's time in the state
            setAudioTimes((prev) => ({
                ...prev,
                [index]: seekTime,
            }));
        }
    };

    const handleDeleteClick = (record: any) => {
        setRecordToDelete(record);                  
        setShowDeletionConfirmation(true);      
    };

    const handleConfirmDelete = async () => {
        if (recordToDelete) {
            try {
                const server = await Server.getInstance();
                
                await server.deleteUploadedSampleAdudioFile(recordToDelete.sample_audio_file_id);

                setRecords(records.filter((record) => record.sample_audio_file_id !== recordToDelete.sample_audio_file_id));
                setRecordToDelete(null);
                setShowDeletionConfirmation(false);
            } catch (error) {
                console.error("Error deleting record:", error);
            }
        }
    };

    const handleCancelDelete = () => {
        setRecordToDelete(null);
        setShowDeletionConfirmation(false);
    };

    const handleEditClick = (record: any) => {
        setSelectedRecord(record);
        setShowEditOverlay(true);
    };

    const handleEditRecord = async (updatedRecord: any) => {
        try {
            const server = await Server.getInstance();

            await server.updateSampleAudioFile(updatedRecord);
            
            setRecords((previousRecords) => {
                const updatedRecords = [...previousRecords];
                const index = updatedRecords.findIndex((record) => record.id === updatedRecord.id);
                updatedRecords[index] = updatedRecord;
                return updatedRecords;
            });
            
            setSelectedRecord(null);
            setShowEditOverlay(false);
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };

    return (
        <div 
            id  =   "voices-my-library-page"
        >
            <NavigationBar />
            <div 
                id  =   "voices-my-library-page-container"
            >
                <MyLibrarySectionBar 
                    currentOption   =   "voices" 
                />
                <div 
                    id  =   "voices-my-library-page-content"
                >
                    <button
                        id      =   "voices-my-library-page-add-book-button"
                        onClick =   {handleAddClick}
                    >
                        Add
                        <img
                            src         =   {IMAGES.ADD_ICON}
                            alt         =   "Add Icon"
                            className   =   "voices-my-library-page-add-icon"
                        />
                    </button>

                    <h1 
                        id  =   "books-my-library-page-title"
                    >
                        My Library
                    </h1>

                    {/* Scrollable section for records */}
                    <div 
                        id  =   "voices-my-library-page-record-list-container"
                    >
                        {
                            loading ? (<LoadingText />) : (
                                records.length === 0 ? <NoVoiceText /> : (
                                    records.map((record, index) => (
                                        <div 
                                            key         =   {record.sample_audio_file_id} 
                                            className   =   "record-item"
                                        >
                                            <div 
                                                className   =   "record-header"
                                            >
                                                <span 
                                                    className   =   "sample-audio-file-name"
                                                >
                                                    {record.file_name}
                                                </span>
                                            </div>
            
                                            <div 
                                                className   =   "record-body"
                                            >
                                                {/* Left Column */}
                                                <div 
                                                    className   =   "record-left-column"
                                                >
                                                    <audio
                                                        ref             =   {(el) => (audioRefs.current[index] = el!)}
                                                        src             =   {
                                                            record.content
                                                        }

                                                        onTimeUpdate    =   {() =>
                                                            setAudioTimes((prev) => ({
                                                                ...prev,
                                                                [index]: audioRefs.current[index].currentTime,
                                                            }))
                                                        }

                                                        onEnded         =   {() => setPlayingIndex(null)}
                                                    />
            
                                                    <input
                                                        type        =   "range"
                                                        min         =   "0"
                                                        max         =   "100"
                                                        value       =   {(audioTimes[index] / audioRefs.current[index]?.duration) * 100 || 0}
                                                        onChange    =   {(event) => handleSeek(event, index)}
                                                        className   =   "audio-slider"
                                                    />
            
                                                    <div 
                                                        className   =   "slider-container"
                                                    >
                                                        <div 
                                                            className   =   "time-labels"
                                                        >
                                                            <span 
                                                                className   =   "start-time"
                                                            >
                                                                00:00
                                                            </span>
                                                            
                                                            <span 
                                                                className   =   "current-time"
                                                            >
                                                                {isNaN(audioTimes[index]) || audioTimes[index] === null
                                                                ? "00:00"  // Fallback in case of invalid value
                                                                : new Date(audioTimes[index] * 1000).toISOString().substring(14, 19)}
                                                            </span>
                                                            
                                                            <span className="end-time">
                                                                {audioRefs.current[index]?.duration
                                                                    ? new Date(audioRefs.current[index].duration * 1000)
                                                                        .toISOString()
                                                                        .substring(14, 19)
                                                                    : "00:00"}
                                                            </span>
                                                        </div>
                                                        
                                                    </div>
                                                    
                                                    <button
                                                        className       =   "play-pause-button"
                                                        onClick         =   {()     => handlePlayPause(index)}
                                                        onMouseEnter    =   {(e)    => {
                                                            const imgElement = e.currentTarget.querySelector("img");
                                                            if (imgElement) {
                                                                if (playingIndex === index) 
                                                                    imgElement.src = IMAGES.HOVERED_PAUSE_BUTTON_ICON;
                                                                else 
                                                                    imgElement.src = IMAGES.HOVERED_PLAY_BUTTON_ICON;
                                                            }
                                                        }}
                                                        onMouseLeave    =   {(e) => {
                                                            const imgElement = e.currentTarget.querySelector("img");
                                                            if (imgElement) {
                                                                if (playingIndex === index) 
                                                                    imgElement.src = IMAGES.PAUSE_BUTTON_ICON;
                                                                else 
                                                                    imgElement.src = IMAGES.PLAY_BUTTON_ICON;
                                                            }
                                                        }}
                                                    >
                                                        <img
                                                            src         =   {playingIndex === index ? IMAGES.PAUSE_BUTTON_ICON : IMAGES.PLAY_BUTTON_ICON}
                                                            alt         =   {playingIndex === index ? "Pause Icon" : "Play Icon"}
                                                            className   =   "play-pause-icon"
                                                        />
                                                    </button>
                                                </div>
            
                                                {/* Right Column */}
                                                <div className="record-right-column">
                                                    <button
                                                        className       =   "record-item-edit-button"
                                                        onClick         =   {() => handleEditClick(record)}
                                                    >
                                                        Edit
                                                        <img
                                                            src         =   {IMAGES.WHITE_PENCIL_ICON}
                                                            alt         =   "Edit Icon"
                                                            className   =   "record-item-button-icon"
                                                        />
                                                    </button>
            
                                                    <button
                                                        className       =   "record-item-delete-button"
                                                        onClick         =   {() => handleDeleteClick(record)}
                                                    >
                                                        Delete
                                                        <div 
                                                            className   =   "record-item-button-icon"
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
                                    ))
                                )
                            )
                        }
                    </div>
                </div>
            </div>

            <BookDeletionConfirmationBox
                title                       =   "Delete your sample audio file"
                message                     =   "Are you sure you want to delete this file?"
                showDeletionConfirmation    =   {showDeletionConfirmation}
                onConfirm                   =   {handleConfirmDelete}
                onCancel                    =   {handleCancelDelete}
            />

            <AddSampleAudioFileOverlay
                showAddOverlay              =   {showAddOverlay}
                setShowAddOverlay           =   {setShowAddOverlay}
                selectedFile                =   {selectedFile}
                setSelectedFile             =   {setSelectedFile}
                fileName                    =   {fileName}
                setFileName                 =   {setFileName}
                description                 =   {description}
                setDescription              =   {setDescription}
                handleFileSelect            =   {handleFileSelect}
                handleSampleAudioFileUpload =   {handleSampleAudioFileUpload}
            />

            <EditSampleAudioFileOverlay
                showEditOverlay     =   {showEditOverlay}
                setShowEditOverlay  =   {setShowEditOverlay}
                selectedRecord      =   {selectedRecord}
                setSelectedRecord   =   {setSelectedRecord}
                handleEditRecord    =   {handleEditRecord}
            />
        </div>
    );
}
