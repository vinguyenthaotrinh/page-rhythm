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

function UserAccountItem({ userAccount, setUserAccounts }: { userAccount: any, setUserAccounts: any }) {
    const [status, setStatus]       =   useState(userAccount.account_status);
    const [fromDate, setFromDate]   =   useState("");
    const [toDate, setToDate]       =   useState("");
    const [isChanged, setIsChanged] =   useState(false); 

    const isValidDate = (date: string) => {
        return date && !isNaN(Date.parse(date));
    };

    const areDatesValid = (from: string, to: string) => {
        if (!isValidDate(from) || !isValidDate(to)) 
            return false;
        const fromParsed    =   new Date(from);
        const toParsed      =   new Date(to);
        return fromParsed < toParsed && toParsed > new Date();
    };

    const handleSaveButtonClicked = async () => {
        const server = await Server.getInstance();

        if (status === "permanently_banned") {
            try {
                await server.banUserAccountPermanently(userAccount.account_id);
                setIsChanged(false);
                setUserAccounts((prevUserAccounts: any) => {
                    const updatedUserAccounts = prevUserAccounts.map((prevUserAccount: any) => {
                        if (prevUserAccount.account_id === userAccount.account_id) {
                            return { ...prevUserAccount, account_status: "permanently_banned" };
                        }
                        return prevUserAccount;
                    });
                    return updatedUserAccounts;
                });
            } catch (error) {
                console.error("Error banning user account permanently:", error);
            }
        } else if (status === "temporarily_banned") {
            if (areDatesValid(fromDate, toDate)) {
                try {
                    await server.banUserAccountTemporarily(userAccount.account_id, fromDate, toDate);
                    setIsChanged(false);
                    setUserAccounts((prevUserAccounts: any) => {
                        const updatedUserAccounts = prevUserAccounts.map((prevUserAccount: any) => {
                            if (prevUserAccount.account_id === userAccount.account_id) {
                                return { 
                                    ...prevUserAccount, 
                                    account_status: "temporarily_banned",
                                    ban_information: {
                                        start_time: fromDate + "T00:00:00Z",
                                        end_time: toDate + "T00:00:00Z"
                                    }
                                };
                            }
                            return prevUserAccount;
                        });
                        return updatedUserAccounts;
                    });
                } catch (error) {
                    console.error("Error banning user account temporarily:", error);
                }
            }
        } else if (status === "active") {
            try {
                await server.unbanUserAccount(userAccount.account_id);
                setIsChanged(false);
                setUserAccounts((prevUserAccounts: any) => {
                    const updatedUserAccounts = prevUserAccounts.map((prevUserAccount: any) => {
                        if (prevUserAccount.account_id === userAccount.account_id) {
                            return { 
                                ...prevUserAccount, 
                                account_status: "active",
                                ban_information: null
                            };
                        }
                        return prevUserAccount;
                    });
                    return updatedUserAccounts;
                });
            } catch (error) {
                console.error("Error unbanning user account:", error);
            }
        }
    }

    useEffect(() => {
        if (userAccount.ban_information) {
            const { start_time, end_time } = userAccount.ban_information;
            setFromDate(start_time.split("T")[0]);  // Extract date only
            setToDate(end_time.split("T")[0]);      // Extract date only
        }
    }, [userAccount]);

    useEffect(() => {
        let changed = false;

        if (status !== userAccount.account_status && status !== "temporarily_banned") 
            changed = true;

        if (status === "temporarily_banned" && userAccount.account_status === status) {
            const oldFromDate   = userAccount.ban_information.start_time.split("T")[0];     // Extract date only
            const oldToDate     = userAccount.ban_information.end_time.split("T")[0];       // Extract date only

            if (areDatesValid(fromDate, toDate) && (fromDate !== oldFromDate || toDate !== oldToDate)) {
                changed = true;
            }
        }

        if (status === "temporarily_banned" && userAccount.account_status !== status) {
            if (areDatesValid(fromDate, toDate)) {
                changed = true;
            }
        }

        setIsChanged(changed);
    }, [status, fromDate, toDate, userAccount]);

    return (
        <div 
            className   =   "accounts-admin-page-account-item"
        >
            {/* Row 1: Profile picture, full name, email */}
            <div 
                className   =   "account-item-row"
            >
                <img 
                    src         =   {IMAGES.decodeProfilePicture(userAccount.profile_picture)}
                    alt         =   "Profile" 
                    className   =   "profile-picture-circle" 
                />
                <div 
                    className   =   "account-info"
                >
                    <p 
                        className   =   "full-name"
                    >
                        {userAccount.full_name}
                    </p>
                    <p 
                        className   =   "email"
                    >
                        {userAccount.email}
                    </p>
                </div>
            </div>

            {/* Row 2: Status dropdown */}
            <div 
                className   =   "account-item-row"
            >
                <label 
                    className   =   "status-label"
                >
                    Status:
                </label>
                <select 
                    value       =   {status} 
                    onChange    =   {(e) => setStatus(e.target.value)}
                    className   =   "status-dropdown"
                >
                    <option 
                        value   =   "active"
                    >
                        Normal              
                    </option>
                    <option 
                        value   =   "temporarily_banned"
                    >
                        Temporarily banned  
                    </option>
                    <option 
                        value   =   "permanently_banned"
                    >
                        Permanently banned
                    </option>
                </select>
            </div>

            {/* Row 3: From date, to date, Save button */}
            <div 
                className   =   "account-item-row"
            >
                <label
                    className   =   {`user-account-item-third-row-text ${status !== "temporarily_banned" ? "disabled" : ""}`}
                >
                    From:
                </label>
                <input 
                    type        =   "date" 
                    value       =   {fromDate} 
                    onChange    =   {(e) => setFromDate(e.target.value)}
                    disabled    =   {status !== "temporarily_banned"}
                    className   =   {`user-account-item-date-input ${status !== "temporarily_banned" ? "disabled" : ""}`}
                />
                <label
                    className   =   {`user-account-item-third-row-text ${status !== "temporarily_banned" ? "disabled" : ""}`}
                >to:
                </label>
                <input 
                    type        =   "date" 
                    value       =   {toDate} 
                    onChange    =   {(e) => setToDate(e.target.value)}
                    disabled    =   {status !== "temporarily_banned"}
                    className   =   {`user-account-item-date-input ${status !== "temporarily_banned" ? "disabled" : ""}`}
                />
                <button 
                    className   =   "save-button" 
                    onClick     =   {handleSaveButtonClicked} 
                    disabled    =   {!isChanged}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default function AccountsAdminPage() {
    const [userAccounts, setUserAccounts]                               = useState<any[]>([]);
    const [loading, setLoading]                                         = useState(true);
    const navigate                                                      = useNavigate();

    useEffect(() => {
        const fetchUserAccounts = async () => {
            try {
                setLoading(true);
                const server    = await Server.getInstance();
                const response  = await server.getAllUserAccountsForManagementPurpose();
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
        <div 
            id  =   "accounts-admin-page"
        >
            <NavigationBar />

            <div 
                id  =   "accounts-admin-page-container"
            >
                <AdminSectionBar 
                    currentOption   =   "accounts" 
                />
                <div 
                    id  =   "accounts-admin-page-content"
                >
                <h1 
                    id  =   "general-profile-page-title"
                >
                    Admin
                </h1>
                    <div 
                        id  =   "accounts-admin-page-accounts-list-container"
                    >
                        {loading ? (<LoadingText />) : (userAccounts.length === 0 ? (<NoUserAccountText />) : 
                            (
                                <div 
                                    id  =   "accounts-admin-page-accounts-grid"
                                >
                                    {userAccounts.map((userAccount, index) => (
                                        <UserAccountItem 
                                            key             =   {index} 
                                            userAccount     =   {userAccount}
                                            setUserAccounts =   {setUserAccounts}
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
