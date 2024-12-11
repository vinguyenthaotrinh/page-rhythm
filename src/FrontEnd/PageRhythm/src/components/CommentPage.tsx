import IMAGES from "../images";
import Server from "../Server";
import "../styles/comment-page-styles.css";
import NavigationBar from "./NavigationBar";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function CommentPage() {

    const { bookID } = useParams<{ bookID: string }>();
    const {repliedCommentID} = useParams<{ repliedCommentID: string }>();

    const navigate = useNavigate();
    const [comment, setComment] = useState<string>(""); // Stores user input for the comment

    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
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
            const parsedRepliedCommentID = (repliedCommentID === "null") ? null : parseInt(repliedCommentID, 10);

            if (parsedRepliedCommentID === null) {
                // If repliedCommentID is "null" or parsed as null, create a new comment
                await server.createComment(bookID, comment);
            } else if (parsedRepliedCommentID !== undefined) {
                // If there is a valid repliedCommentID, reply to an existing comment
                await server.replyToComment(bookID, comment, parsedRepliedCommentID);
            }
            console.log("Comment submitted successfully.");
            navigate(-1); // Navigate back to the previous page after submission
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    return (
        <div
            id = "comment-page"
        >
            <NavigationBar />
            <div
                id = "comment-page-back-button-region"
            >
                <div id="comment-page-back-button-container" onClick={handleBackClick}>
                    <img src={IMAGES.LEFT_ARROW_ICON} alt="Back" className="comment-page-back-button-icon" />
                    <span>Back</span>
                </div>
            </div>
            <div id="comment-page-main-section">
                <h3>Write your comment here</h3>
                <textarea
                    id="comment-textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your comment..."
                />
                <button
                    id="comment-submit-button"
                    onClick={handleCommentSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}