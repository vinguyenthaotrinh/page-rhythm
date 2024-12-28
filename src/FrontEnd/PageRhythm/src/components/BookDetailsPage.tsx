import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import "../styles/book-details-page-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface WriteCommentOverlayProps {
    showWriteCommentOverlay:    boolean;
    comment:                    string;
    setComment:                 (comment: string) => void;
    handleCommentSubmit:        () => void;
}

const WriteCommentOverlay: React.FC<WriteCommentOverlayProps> = ({
    showWriteCommentOverlay,
    comment,
    setComment,
    handleCommentSubmit,
}) => {

    if (!showWriteCommentOverlay) 
        return null;

    return (
        <div 
            className   =   "add-overlay"
        >
            <div 
                className   =   "add-overlay-content"
            >
                <h1 
                    id  =   "add-overlay-title"
                >
                    Write your comment here
                </h1>
                <p>
                    Please enter your comment
                </p>

                <textarea
                    id          =   "comment-textarea"
                    value       =   {comment}
                    onChange    =   {(e) => setComment(e.target.value)}
                    placeholder =   "Enter your comment..."
                />

                <button
                    className       =   {`book-details-page-comment-submit-button ${comment.trim() ? "enabled" : "disabled"}`} // Change the button style based on the comment input
                    onClick         =   {handleCommentSubmit}
                    disabled        =   {!comment.trim()} // Disable the button if the comment is empty
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default function BookDetailsPage() {
    const { bookID }                                    = useParams<{ bookID: string }>();
    const [book, setBook]                               = useState<any>(null);
    const [showCommentOverlay, setShowCommentOverlay]   = useState<boolean>(false);
    const [repliedCommentID, setRepliedCommentID]       = useState<string | null>(null);    // Comment ID for replies
    const [comment, setComment]                         = useState<string>("");             // Stores user input for the comment
    const [userRating, setUserRating]                   = useState<number | null>(null);    // User-selected rating
    const [comments, setComments]                       = useState<any[]>([]);              // Comments for the book

    const handleRating = async (rating: number) => {
        const server = await Server.getInstance();

        if (!bookID) {
            console.error("Book ID is undefined. Cannot delete rating.");
            return; // Exit early if bookID is undefined
        }

        try {
            if (rating === userRating) {
                // If the user clicks the currently selected rating, reset the rating

                if (userRating !== null) {
                    await server.deleteBookRating(bookID); // Delete the existing rating
                    console.log("Rating deleted successfully.");
                }

                setUserRating(null); 
            } else {

                // Delete the existing rating before updating
                if (userRating !== null && userRating !== undefined) {
                    await server.deleteBookRating(bookID);
                    console.log("Existing rating deleted successfully.");
                }
                
                // Update the rating
                setUserRating(rating); // Update the rating locally
                await server.insertBookRating(bookID, rating); // Send the new rating to the server
                console.log(`Rating updated to ${rating}.`);
            }
        } catch (error) {
            console.error("Error handling rating:", error);
        }
    };

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };
    
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                if (!bookID) {
                    console.error("Book ID is not available.");
                    return;
                }

                const server = await Server.getInstance();
                const book = await server.getBook(bookID);  // Fetch the book details using bookID
                setBook(book);                              // Set the book details in state
                const response = await server.getTrackedReadingProgress(parseInt(bookID, 10));
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };

        const fetchUserRating = async () => {
            try {
                if (!bookID) {
                    console.error("Book ID is not available.");
                    return;
                }

                const server = await Server.getInstance();
                const rating = await server.getBookRating(bookID);  // Fetch user rating
                if (rating) {
                    setUserRating(rating.rating);                   // Set the user rating in state
                    console.log("User rating fetched successfully.", rating);
                }
            } catch (error) {
                console.error("Error fetching user rating:", error);
            }
        };

        const fetchComments = async () => {
            try {
                if (!bookID) {
                    console.error("Book ID is not available.");
                    return;
                }

                const server        = await Server.getInstance();
                const commentsData  = await server.retrieveAllComments(bookID);  // Fetch comments for the book
                setComments(commentsData);                                      // Update the state with the fetched comments
                console.log("Comments fetched successfully.", commentsData);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        if (bookID) {
            fetchBookDetails(); 
            fetchUserRating();
            fetchComments();
        }
    }, [bookID]);

    if (!book) {
        return (
            <div
                id = "book-details-page-loading"
            >
                Loading...
            </div>
        );
    }

    // Recursively render comments and their replies
    const renderComment = (comment: any, allComments: any[]) => {
        const replies = allComments.filter((reply: any) => reply.replied_comment_id === comment.comment_id);
    
        return (
            <div 
                key         =   {comment.comment_id} 
                className   =   "comment"
            >
                <div 
                    className   =   "comment-header"
                >
                    <div 
                        className   =   "comment-header-left"
                    >
                        <img 
                            src         =   {IMAGES.DEFAULT_PROFILE_PICTURE} 
                            alt         =   "Profile" 
                            className   =   "profile-picture" 
                        />
                    </div>
                    <div 
                        className   =   "comment-header-right"
                    >
                        <div 
                            className   =   "comment-author"
                        >
                            <span 
                                className   =   "author-username"
                            >
                                {comment.comment_author_full_name}
                            </span>
                            <span 
                                className   =   "comment-date"
                            >
                                {new Date(comment.create_time).toLocaleString()}
                            </span>
                        </div>
                        <div 
                            className   =   "comment-content"
                        >
                            {comment.content}
                        </div>
                    </div>
                </div>
                
                <button 
                    className   =   "book-details-page-reply-button"
                    onClick     =   {() => handleReplyClick(comment.comment_id)}
                >
                    Reply comment
                </button>
    
                {/* Recursively render replies */}
                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply: any) => renderComment(reply, allComments))}
                    </div>
                )}
            </div>
        );
    };
    
    const handleReplyClick = (repliedCommentID: number) => {
        //navigate(`/comment-page/${bookID}/${repliedCommentID}`);
        setRepliedCommentID(repliedCommentID.toString());
        setShowCommentOverlay(true);
    };

    const handleWriteCommentButtonClick = () => {
        //navigate(`/comment-page/${bookID}/null`);
        setRepliedCommentID(null);
        setShowCommentOverlay(true);
    };

    const handleReadThisBookButtonClick = () => {
        navigate(`/read-book-page/${bookID}`);
    };

    const handleListenToBookButtonClick = () => {
        navigate(`/listen-to-book-page/${bookID}`);
    };

    const handleCommentSubmit = async () => {
        if (!comment.trim()) {
            console.error("Comment cannot be empty.");
            return;
        }
    
        if (bookID === undefined) {
            console.error("Book ID is undefined.");
            return;
        }
    
        if (repliedCommentID === undefined) {
            console.error("Replied comment ID is undefined.");
            return;
        }
    
        try {
            const server = await Server.getInstance();
    
            // Parse the repliedCommentID as an integer if it's not "null" string
            const parsedRepliedCommentID = (repliedCommentID === null) ? null : parseInt(repliedCommentID, 10);
    
            if (parsedRepliedCommentID === null) {
                // If repliedCommentID is "null" or parsed as null, create a new comment
                await server.createComment(bookID, comment);
            } else if (parsedRepliedCommentID !== undefined) {
                // If there is a valid repliedCommentID, reply to an existing comment
                await server.replyToComment(bookID, comment, parsedRepliedCommentID);
            }
            console.log("Comment submitted successfully.");

            const updatedComments = await server.retrieveAllComments(bookID);
            setComments(updatedComments);

            setShowCommentOverlay(false);   // Close the comment overlay after submission
            setComment("");                 // Clear the comment input    
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    // Render the comment tree
    const renderCommentTree = () => {
        // Root comments are those that don't have a replied_comment_id
        const rootComments = comments.filter((comment: any) => !comment.replied_comment_id);
        return (
            <div className="comments-section">
                {rootComments.map((comment: any) => renderComment(comment, comments))}
            </div>
        );
    };

    const getStarRating = (rating: number) => {
        const roundedRating = Math.round(rating);
        let stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < roundedRating) {
                stars.push(<img key={i} src={IMAGES.FILLED_STAR_ICON} alt="Star" className="star-icon" />);
            } else {
                stars.push(<img key={i} src={IMAGES.EMPTY_STAR_ICON} alt="Star" className="star-icon" />);
            }
        }
        return stars;
    }

    return (
        <div
            id  =   "book-details-page"
        >
            <NavigationBar />
            <div
                id  =   "book-details-page-back-button-region"
            >
                <div 
                    id      =   "book-details-page-back-button-container" 
                    onClick =   {handleBackClick}
                >
                    <img 
                        src         =   {IMAGES.LEFT_ARROW_ICON} 
                        alt         =   "Back" 
                        className   =   "book-details-page-back-button-icon" 
                    />
                    <span>Back</span>
                </div>
            </div>
            <div
                id = "book-details-page-main-section"
            >
                <div
                    id = "book-details-page-information-section"
                >
                    {/* Left Column (Book Cover) */}
                    <div 
                        id  =   "book-details-page-cover"
                    >
                        <img 
                            src     =   {IMAGES.decodeBookCoverImage(book.image)} 
                            alt     =   "Book Cover" 
                        />
                    </div>

                    {/* Right Column (Book Information) */}
                    <div 
                        id  =   "book-details-page-introduction"
                    >
                        {/* Book Title and Buttons */}
                        <div 
                            className   =   "book-details-page-title-row"
                        >
                            <h2>
                                {book.title}
                            </h2>
                            <div 
                                className   =   "book-details-page-buttons"
                            >
                                <button
                                    id          =   "book-details-page-read-button"
                                    className   =   "book-details-page-button"
                                    onClick     =   {handleReadThisBookButtonClick}
                                >
                                    Read This Book
                                </button>
                                <button
                                    id              =   "book-details-page-listen-button"
                                    className       =   "book-details-page-button"
                                    onClick         =   {handleListenToBookButtonClick}
                                    onMouseEnter    =   {(e) => {
                                        const imgElement = e.currentTarget.querySelector("img");
                                        if (imgElement) 
                                            imgElement.src = IMAGES.HOVERED_PLAY_BUTTON_ICON;
                                    }}
                                    onMouseLeave    =   {(e) => {
                                        const imgElement = e.currentTarget.querySelector("img");
                                        if (imgElement) 
                                            imgElement.src = IMAGES.PLAY_BUTTON_ICON;
                                    }}
                                >   
                                    <img
                                        src         =   {IMAGES.PLAY_BUTTON_ICON}
                                        alt         =   "Listen"
                                        className   =   "read-book-page-button-icon"
                                    />
                                    Listen To Audio Book
                                </button>
                            </div>
                        </div>

                        <div 
                            className   =   "book-details-row"
                        >
                            <strong>
                                Author:
                            </strong> 
                            {book.author}
                        </div>

                        {
                            book && book.book_rating && (
                                <div 
                                    className   =   "book-details-row"
                                >
                                    <strong>
                                        Rating:
                                    </strong>
                                    <div 
                                        className   =   "star-rating"
                                    >
                                        {getStarRating(book.book_rating)}
                                        <span>
                                            {book.book_rating}
                                        </span>
                                    </div>
                                </div>
                            )
                        }

                        <div 
                            className   =   "book-details-row"
                        >
                            <strong>
                                Release Date:
                            </strong> 
                            {new Date(book.released_date).toLocaleDateString()}
                        </div>

                        <div 
                            className   =   "book-details-row"
                        >
                            <strong>
                                Genre:
                            </strong> 
                            {book.genre}
                        </div>

                        <div 
                            className   =   "book-details-row"
                        >
                            <strong>
                                Summary:
                            </strong> 
                            {book.summary}
                        </div>
                    </div>
                </div>
            </div>

            <div 
                id  =   "book-details-page-review-section"
            >
                <strong>
                    Rating & Comments:
                </strong>
                <div 
                    className="review-section-content"
                >
                    
                    <button 
                        className   =   "write-comment-button"
                        onClick     =   {handleWriteCommentButtonClick}
                    >
                        Write a comment
                    </button>
                    
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <img
                                key         =   {star}
                                src         =   {star <= (userRating || 0) ? IMAGES.FILLED_STAR_ICON : IMAGES.EMPTY_STAR_ICON}
                                alt         =   {`${star} Star`}
                                className   =   "star-icon"
                                onClick     =   {() => handleRating(star)}
                            />
                        ))}
                    </div>                
                </div>
            </div>
            
            <div
                id = "book-details-page-comments-section"
            >
                {renderCommentTree()}
            </div>

            <WriteCommentOverlay 
                showWriteCommentOverlay         =   {showCommentOverlay}
                comment                         =   {comment}
                setComment                      =   {setComment}
                handleCommentSubmit             =   {handleCommentSubmit}
            />

        </div>
    )
}