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
                                    {userAccounts.map((userAccount, index) => (
                                        <div 
                                            key={index} 
                                            className="accounts-admin-page-account-item"
                                        >
                                            {userAccount.email}
                                        </div>
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
