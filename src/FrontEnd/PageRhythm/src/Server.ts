export default class Server {
    private static instance: Server | null = null;
    private host: string | null = null;

    private constructor() {}

    public static async getInstance(): Promise<Server> {
        if (Server.instance === null) {
            Server.instance = new Server();
            await Server.instance.initializeHost(
                null,//"https://page-rhythm-back-end.onrender.com", 
                "http://127.0.0.1:5000"
            );
        }
        return Server.instance;
    }

    private async initializeHost(deployedUrl: string | null, localUrl: string | null): Promise<void> {
        if (deployedUrl === null && localUrl === null) {
            throw new Error("Both deployedUrl and localUrl cannot be null.");
        }

        if (deployedUrl === null) {
            this.host = localUrl!;
            console.log("Host set directly to local URL:", localUrl);
            return;
        }

        if (localUrl === null) {
            this.host = deployedUrl!;
            console.log("Host set directly to deployed URL:", deployedUrl);
            return;
        }

        try {
            const response = await fetch(`${deployedUrl}/health`);
            if (response.ok) {
                this.host = deployedUrl;
                console.log("Server host set to deployed URL:", deployedUrl);
            } else {
                throw new Error("Deployed server health check failed");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.host = localUrl;
            console.warn("Falling back to local host due to health check failure:", errorMessage);
        }
    }

    public getHost(): string | null {
        return this.host;
    }

    public async sendRequest(endpoint: string, method: string = "GET", body: object | null = null): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }

        const url = `${this.host}${endpoint}`;
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : null,
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error sending request:", error);
            throw error;
        }
    }

    public async login(email: string, password: string): Promise<Response> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/authentication/login`;
        const body = {
            email,
            password,
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("sessionToken", data["access_token"]); // Save the session token if login is successful
                console.log("Login successful, session token stored.");
            }
    
            return response;    // Return the pure response object
        } catch (error) {
            console.error("Error during login:", error);
            throw error;        // Rethrow the error to handle it elsewhere
        }
    }

    public getSessionToken(): string | null {
        return localStorage.getItem("sessionToken");
    }

    public async signup(fullName: string, email: string, password: string, birthday: string, bio: string): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }

        const url = `${this.host}/authentication/register`;

        const body = {
            "email": email,
            "full_name": fullName,
            "first_name": "",
            "last_name": "",
            "birthday": {
                "day": parseInt(birthday.split("-")[2], 10),    // Parse the day as an integer
                "month": parseInt(birthday.split("-")[1], 10),  // Parse the month as an integer
                "year": parseInt(birthday.split("-")[0], 10),   // Parse the year as an integer
            },
            "password": password,
            "bio": bio,
            "account_type": "user",
            "profile_picture": null,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("sessionToken", data["access_token"]); // Save the session token if signup is successful
                console.log("Signup successful, session token stored.");
            }

            return response;    // Return the pure response object
        } catch (error) {
            console.error("Error during signup:", error);
            throw error;        // Rethrow the error to handle it elsewhere
        }
    }

    public async logout(): Promise<void> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }

        localStorage.removeItem("sessionToken");
    }

    public async getAllBooksInRandomOrder(): Promise<any[]> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/book/all/random`;  // Update the endpoint to match the server-side route
    
        const sessionToken = this.getSessionToken();

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`  // Include the session token if required for authorization
                }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch books. Status: ${response.status}`);
            }
    
            const books = await response.json();  // The response is expected to be a JSON array of books
    
            return books;  // Return the shuffled list of books
        } catch (error) {
            console.error("Error fetching books:", error);
            throw error;  // Rethrow the error to handle it elsewhere
        }
    }

    // New method to fetch profile data
    public async getProfile(): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }

        const url = `${this.host}/account/profile`; // Endpoint to get the profile

        const sessionToken = this.getSessionToken();

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`, // Authorization header with JWT token
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Profile fetched successfully:", data);
                return data;  // Returns the profile data
            } else {
                throw new Error("Profile fetch failed");
            }
        } catch (error) {
            console.error("Error during profile fetch:", error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async updateProfile(profile: any): Promise<void> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/account/update_account_profile_information`; // Endpoint to update the profile
    
        const sessionToken = this.getSessionToken();
    
        const body = {
            full_name: profile.fullName,
            email: profile.email,
            bio: profile.bio,
            first_name: "",
            last_name: "",
            profile_picture: null,
            birthday: {
                day: parseInt(profile.birthday.split("-")[2], 10),    // Parse the day as an integer
                month: parseInt(profile.birthday.split("-")[1], 10),  // Parse the month as an integer
                year: parseInt(profile.birthday.split("-")[0], 10),   // Parse the year as an integer
            }
        };
    
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`, // Authorization header with JWT token
                },
                body: JSON.stringify(body), // Send the updated profile data as the body
            });
    
            if (response.ok) {
                console.log("Profile updated successfully.");
            } else {
                throw new Error(`Profile update failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error during profile update:", error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async changePassword(passwords: any): Promise<void> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/authentication/change_password`;  // Endpoint to change the password
    
        const sessionToken = this.getSessionToken();
    
        const body = {
            old_password: passwords.currentPassword,
            new_password: passwords.newPassword,
            confirmed_new_password: passwords.confirmedNewPassword,
        };
    
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`, // Authorization header with JWT token
                },
                body: JSON.stringify(body), // Send the password data as the body
            });
    
            if (response.ok) {
                console.log("Password changed successfully.");
                // You can add further success handling here, e.g., notify the user.
            } else {
                const data = await response.json();
                console.error("Error changing password:", data.message);
                // Handle specific error messages from the server.
                throw new Error(data.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Error during password change:", error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async searchBooks(title: string, genre: string | null): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = new URL(`${this.host}/book/search`);  // Construct the URL for the search endpoint
    
        // Add query parameters for title and genre
        if (title) {
            url.searchParams.append('title', title);
        }
    
        if (genre) {
            url.searchParams.append('genre', genre);
        }
    
        const sessionToken = this.getSessionToken();
    
        try {
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`, // Include session token if required for authorization
                },
            });
    
            if (!response.ok) {
                throw new Error(`Search request failed with status: ${response.status}`);
            }
    
            const books = await response.json();  // Expecting a JSON array of books
            return books;  // Return the array of books found
        } catch (error) {
            console.error("Error during search:", error);
            throw error;  // Rethrow the error to handle it elsewhere
        }
    }
    
    public async getBook(bookID: string): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/book/${bookID}`;  // Update the endpoint to match the server-side route
    
        const sessionToken = this.getSessionToken();
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`  // Include the session token if required for authorization
                }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch book. Status: ${response.status}`);
            }
    
            const book = await response.json();  // The response is expected to be a JSON object representing the book
    
            return book;  // Return the book object
        } catch (error) {
            console.error("Error fetching book:", error);
            throw error;  // Rethrow the error to handle it elsewhere
        }
    }

    public async deleteBookRating(bookID: string): Promise<void> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `/book_rating/${bookID}`; // Backend endpoint for deleting a rating
        const sessionToken = this.getSessionToken();
    
        if (!sessionToken) {
            throw new Error("Session token is missing. Please log in again.");
        }
    
        try {
            const response = await fetch(`${this.host}${url}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`, // Ensure the token is included
                },
            });
    
            if (!response.ok) {
                // Log the status and error details
                console.error(
                    `Failed to delete rating for book ${bookID}. HTTP status: ${response.status}, message: ${response.statusText}`
                );
                throw new Error(`Failed to delete rating: ${response.statusText} (${response.status})`);
            }
    
            console.log(`Rating for book ${bookID} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting rating for book ${bookID}:`, error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async getBookRating(bookID: string): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/book_rating/${bookID}/my_rating`; // Backend endpoint for fetching a book's rating
    
        const sessionToken = this.getSessionToken();
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}` // Include the session token if required for authorization
                }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch rating for book ${bookID}. Status: ${response.status}`);
            }
    
            const rating = await response.json(); // The response is expected to be a JSON object representing the rating
    
            return rating; // Return the rating object
        } catch (error) {
            console.error(`Error fetching rating for book ${bookID}:`, error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async insertBookRating(bookID: string, rating: number): Promise<void> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/book_rating/create`;  // The endpoint for creating a new rating
    
        const sessionToken = this.getSessionToken();
    
        const body = {
            book_id: bookID,
            rating: rating,
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`, // Authorization header with JWT token
                },
                body: JSON.stringify(body), // Send the rating data as the body
            });
    
            if (response.ok) {
                console.log("Rating inserted successfully.");
            } else {
                const data = await response.json();
                console.error("Error inserting rating:", data.message || "Failed to insert rating");
                throw new Error(data.message || "Failed to insert rating");
            }
        } catch (error) {
            console.error("Error during rating insertion:", error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async getAllComments(bookID: string): Promise<any[]> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/comment/get_all_comments?book_id=${bookID}`; // Backend endpoint to fetch all comments for a book
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch comments for book ${bookID}. Status: ${response.status}`);
            }
    
            const comments = await response.json(); // The response is expected to be a JSON array of comments
            return comments; // Return the array of comments
        } catch (error) {
            console.error(`Error fetching comments for book ${bookID}:`, error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async retrieveAllComments(bookID: string): Promise<any[]> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/comment/retrieve_all_comments?book_id=${bookID}`; // Backend endpoint to fetch all comments for a book
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch comments for book ${bookID}. Status: ${response.status}`);
            }
    
            const comments = await response.json(); // The response is expected to be a JSON array of comments
            return comments; // Return the array of comments
        } catch (error) {
            console.error(`Error fetching comments for book ${bookID}:`, error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async createComment(bookID: string, content: string): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/comment/create`; // Endpoint for creating a new comment
    
        const sessionToken = this.getSessionToken();
    
        if (!sessionToken) {
            throw new Error("Session token is missing. Please log in again.");
        }
    
        const body = {
            book_id: bookID, // The book ID the comment is associated with
            content: content, // The content of the comment
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`, // Authorization header with JWT token
                },
                body: JSON.stringify(body), // Send the comment data as the body
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error creating comment:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to create comment.");
            }
    
            const result = await response.json(); // The response is expected to confirm success
            console.log("Comment created successfully:", result);
            return result; // Return the success result
        } catch (error) {
            console.error("Error during comment creation:", error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async replyToComment(bookID: string, content: string, repliedCommentID: number): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/comment/reply`; // Endpoint for replying to a comment
    
        const sessionToken = this.getSessionToken();
    
        if (!sessionToken) {
            throw new Error("Session token is missing. Please log in again.");
        }
    
        const body = {
            book_id: bookID, // The book ID associated with the reply
            content: content, // The content of the reply
            replied_comment_id: repliedCommentID, // The ID of the comment being replied to
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`, // Include JWT token for authorization
                },
                body: JSON.stringify(body), // Send the reply data as the body
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error replying to comment:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to reply to comment.");
            }
    
            const result = await response.json(); // The response is expected to confirm success
            console.log("Reply created successfully:", result);
            return result; // Return the success result
        } catch (error) {
            console.error("Error during reply creation:", error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    public async getContentPages(bookID: number, pageCapacity: number): Promise<any[]> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/book/get_all_book_pages/${bookID}/${pageCapacity}`; // Endpoint to fetch book pages

        try {
            // Assuming you have a method to fetch book pages from the database or an API.
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Ensure the response is OK
            if (!response.ok) {
                throw new Error(`Error fetching pages: ${response.statusText}`);
            }
    
            const data = await response.json();
            return data; // Return the fetched pages data
    
        } catch (error) {
            console.error("Error fetching content pages:", error);
            throw error;
        }
    }
}
