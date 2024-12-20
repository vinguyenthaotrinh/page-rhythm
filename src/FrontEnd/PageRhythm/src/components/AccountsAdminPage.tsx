import IMAGES from "../images";
import Server from "../Server";
import NavigationBar from "./NavigationBar";
import AdminSectionBar from "./AdminSectionBar";
import "../styles/accounts-admin-page-styles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoadingText() {
    return (
        <p
            id = "accounts-admin-page-loading-text"
        >
            Loading...
        </p>
    );
}

function NoUserAccountText() {
    return (
        <p
            id = "books-my-library-page-loading-text"
        >
            There is no user account to display.
        </p>
    );
}

export default function AccountsAdminPage() {
    const [userAccounts, setUserAccounts]                               = useState<any[]>([]);              // User accounts data state
    const [loading, setLoading]                                         = useState(true);                   // Loading state
    const navigate                                                      = useNavigate();

    useEffect(() => {
        const fetchUserAccounts = async () => {
            try {
                setLoading(true);
                const server = await Server.getInstance();
                const response = await server.getAllUserAccounts();
                setUserAccounts(response);
            } catch (error) {
                console.error("Error fetching user accounts:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserAccounts();
    }, []);

    return (
        <div id="accounts-admin-page">
            <NavigationBar />

            <div id="accounts-admin-page-container">
                <AdminSectionBar currentOption="accounts" />
                <div id="accounts-admin-page-content">
                    
                    <div id="accounts-admin-page-accounts-list-container">
                        {loading ? (<LoadingText />) : (userAccounts.length === 0 ? (<NoUserAccountText />) : 
                            (
                                <div id="accounts-admin-page-accounts-grid">
                                    {userAccounts.map((userAccount, index) => {
                                        const [status, setStatus] = useState("Normal"); // Default status
                                        const [fromDate, setFromDate] = useState("");
                                        const [toDate, setToDate] = useState("");
                                        const [isChanged, setIsChanged] = useState(false); // To track if any field changed

                                        // Check if "Save" button should be enabled
                                        useEffect(() => {
                                            setIsChanged(status !== "Normal" || fromDate !== "" || toDate !== "");
                                        }, [status, fromDate, toDate]);

                                        return (
                                            <div 
                                                key={index} 
                                                className="accounts-admin-page-account-item"
                                            >
                                                {/* Row 1: Profile picture, full name, email */}
                                                <div className="account-item-row">
                                                    <img 
                                                        src={IMAGES.decodeProfilePicture(userAccount.profile_picture)} 
                                                        alt="Profile" 
                                                        className="profile-picture-circle" 
                                                    />
                                                    <div className="account-info">
                                                        <p className="full-name">{userAccount.full_name}</p>
                                                        <p className="email">{userAccount.email}</p>
                                                    </div>
                                                </div>

                                                {/* Row 2: Status dropdown */}
                                                <div className="account-item-row">
                                                    <label className="status-label">Status:</label>
                                                    <select 
                                                        value={status} 
                                                        onChange={(e) => setStatus(e.target.value)}
                                                        className="status-dropdown"
                                                    >
                                                        <option value="Normal">Normal</option>
                                                        <option value="Temporarily banned">Temporarily banned</option>
                                                        <option value="Permanently banned">Permanently banned</option>
                                                    </select>
                                                </div>

                                                {/* Row 3: From date, to date, Save button */}
                                                <div 
                                                    className={`account-item-row ${status !== "Temporarily banned" ? "disabled" : ""}`}
                                                >
                                                    <label>From:</label>
                                                    <input 
                                                        type="date" 
                                                        value={fromDate} 
                                                        onChange={(e) => setFromDate(e.target.value)}
                                                        disabled={status !== "Temporarily banned"}
                                                    />
                                                    <label>to:</label>
                                                    <input 
                                                        type="date" 
                                                        value={toDate} 
                                                        onChange={(e) => setToDate(e.target.value)}
                                                        disabled={status !== "Temporarily banned"}
                                                    />
                                                    <button 
                                                        className="save-button" 
                                                        onClick={() => {
                                                            // Save logic here
                                                            console.log("Saving user:", userAccount.email, { status, fromDate, toDate });
                                                        }} 
                                                        disabled={!isChanged || status !== "Temporarily banned"}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
