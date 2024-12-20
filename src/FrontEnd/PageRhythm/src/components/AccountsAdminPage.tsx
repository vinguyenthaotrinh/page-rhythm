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

function UserAccountItem({ userAccount }: { userAccount: any }) {
    const [status, setStatus]       = useState(userAccount.account_status);
    const [fromDate, setFromDate]   = useState("");
    const [toDate, setToDate]       = useState("");
    const [isChanged, setIsChanged] = useState(false); // To track if any field changed

    // Check if "Save" button should be enabled
    useEffect(() => {
        setIsChanged((status !== userAccount.account_status) || (fromDate !== "") || (toDate !== ""));
    }, [status, fromDate, toDate]);

    return (
        <div className="accounts-admin-page-account-item">
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
                    <option value="active">Normal</option>
                    <option value="temporarily_banned">Temporarily banned</option>
                    <option value="permanently_banned">Permanently banned</option>
                </select>
            </div>

            {/* Row 3: From date, to date, Save button */}
            <div 
                className="account-item-row"
            >
                <label
                    className={`user-account-item-third-row-text ${status !== "temporarily_banned" ? "disabled" : ""}`}
                >
                    From:
                </label>
                <input 
                    type="date" 
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)}
                    disabled={status !== "temporarily_banned"}
                    className = {`user-account-item-date-input ${status !== "temporarily_banned" ? "disabled" : ""}`}
                />
                <label
                    className={`user-account-item-third-row-text ${status !== "temporarily_banned" ? "disabled" : ""}`}
                >to:
                </label>
                <input 
                    type="date" 
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)}
                    disabled={status !== "temporarily_banned"}
                    className = {`user-account-item-date-input ${status !== "temporarily_banned" ? "disabled" : ""}`}
                />
                <button 
                    className="save-button" 
                    onClick={() => {
                        console.log("Saving user:", userAccount.email, { status, fromDate, toDate });
                    }} 
                    disabled={!isChanged}
                >
                    Save
                </button>
            </div>
        </div>
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
                const response = await server.getAllUserAccountsForManagementPurpose();
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
                                    {userAccounts.map((userAccount, index) => (
                                        <UserAccountItem 
                                            key={index} 
                                            userAccount={userAccount} 
                                        />
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
