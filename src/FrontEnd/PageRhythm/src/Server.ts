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
        if (deployedUrl === null && localUrl === null) 
            throw new Error("Both deployedUrl and localUrl cannot be null.");

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
            } else 
                throw new Error("Deployed server health check failed");
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
        if (!this.host) 
            throw new Error("Host is not initialized.");

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
            if (!response.ok) 
                throw new Error(`Request failed with status: ${response.status}`);
            return await response.json();
        } catch (error) {
            this.logAndThrowError("Error sending request:", error);
        }
    }

    public async login(email: string, password: string): Promise<Response> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
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
            this.logAndThrowError("Error during login:", error);
        }
    }

    public getSessionToken(): string | null {
        return localStorage.getItem("sessionToken");
    }

    public findSessionToken(): string {
        const sessionToken = this.getSessionToken();
        if (!sessionToken) 
            throw new Error("Session token is missing. Please log in again.");
        return sessionToken;
    }

    public async signup(fullName: string, email: string, password: string, birthday: string, bio: string): Promise<any> {
        if (!this.host) 
            throw new Error("Host is not initialized.");

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
            this.logAndThrowError("Error during signup:", error);
        }
    }

    public async logout(): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");

        localStorage.removeItem("sessionToken");
    }

    public async getAllBooksInRandomOrder(): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/book/all/random`;  

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch books. Status: ${response.status}`);
    
            const books = await response.json();  // The response is expected to be a JSON array of books
    
            return books;  // Return the shuffled list of books
        } catch (error) {
            this.logAndThrowError("Error fetching books:", error);
        }
    }

    public async getAllPublicBooksInRandomOrder(): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/book/public/all/random`;  
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch books. Status: ${response.status}`);
    
            const books = await response.json();  // The response is expected to be a JSON array of books
    
            return books;  // Return the shuffled list of books
        } catch (error) {
            this.logAndThrowError("Error fetching books:", error);
        }
    }

    private getSimpleHeadersWithSessionToken(): Record<string, string> {
        const sessionToken = this.getSessionToken();

        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionToken}`, // Authorization header with JWT token
        };
    }

    public async getProfile(): Promise<any> {
        if (!this.host) 
            throw new Error("Host is not initialized.");

        const url = `${this.host}/account/profile`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Profile fetched successfully:", data);
                return data;  // Returns the profile data
            } else 
                throw new Error("Profile fetch failed");
        } catch (error) {
            this.logAndThrowError("Error during profile fetch:", error);
        }
    }

    public async updateProfile(profile: any): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/account/update_account_profile_information`;
    
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
                headers: this.getSimpleHeadersWithSessionToken(),
                body: JSON.stringify(body), // Send the updated profile data as the body
            });
    
            if (response.ok) 
                console.log("Profile updated successfully.");
            else 
                throw new Error(`Profile update failed with status: ${response.status}`);
        } catch (error) {
            this.logAndThrowError("Error during profile update:", error);
        }
    }

    public async changePassword(passwords: any): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/authentication/change_password`;  

        const body = {
            old_password: passwords.currentPassword,
            new_password: passwords.newPassword,
            confirmed_new_password: passwords.confirmedNewPassword,
        };
    
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: this.getSimpleHeadersWithSessionToken(),
                body: JSON.stringify(body), // Send the password data as the body
            });
    
            if (response.ok) {
                console.log("Password changed successfully.");
            } else {
                const data = await response.json();
                console.error("Error changing password:", data.message);
                // Handle specific error messages from the server.
                throw new Error(data.message || "Failed to change password");
            }
        } catch (error) {
            this.logAndThrowError("Error during password change:", error);
        }
    }

    public async getAllGenres(): Promise<any> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/book/genres`;
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch genres. Status: ${response.status}`);
    
            const genres = await response.json();
    
            return genres;
        } catch (error) {
            this.logAndThrowError("Error fetching genres:", error);
        }
    }

    public async searchBooks(title: string, genre: string | null): Promise<any> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = new URL(`${this.host}/book/search`);  
    
        // Add query parameters for title and genre
        if (title) 
            url.searchParams.append('title', title);
    
        if (genre) 
            url.searchParams.append('genre', genre);
    
        try {
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) 
                throw new Error(`Search request failed with status: ${response.status}`);
    
            const books = await response.json();  // Expecting a JSON array of books
            return books;  // Return the array of books found
        } catch (error) {
            this.logAndThrowError("Error during search:", error);
        }
    }
    
    public async getBook(bookID: string): Promise<any> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/book/${bookID}`; 
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch book. Status: ${response.status}`);
    
            const book = await response.json();  // The response is expected to be a JSON object representing the book
    
            return book;  // Return the book object
        } catch (error) {
            this.logAndThrowError("Error fetching book:", error);
        }
    }

    public async deleteBookRating(bookID: string): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `/book_rating/${bookID}`;
    
        try {
            const response = await fetch(`${this.host}${url}`, {
                method: "DELETE",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) {
                console.error(
                    `Failed to delete rating for book ${bookID}. HTTP status: ${response.status}, message: ${response.statusText}`
                );
                throw new Error(`Failed to delete rating: ${response.statusText} (${response.status})`);
            }
    
            console.log(`Rating for book ${bookID} deleted successfully.`);
        } catch (error) {
            this.logAndThrowError(`Error deleting rating for book ${bookID}:`, error);
        }
    }

    public async getBookRating(bookID: string): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }
    
        const url = `${this.host}/book_rating/${bookID}/my_rating`; 
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch rating for book ${bookID}. Status: ${response.status}`);
    
            const rating = await response.json(); // The response is expected to be a JSON object representing the rating
    
            return rating; // Return the rating object
        } catch (error) {
            this.logAndThrowError(`Error fetching rating for book ${bookID}:`, error);
        }
    }

    public async insertBookRating(bookID: string, rating: number): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/book_rating/create`; 
    
        const body = {
            book_id: bookID,
            rating: rating,
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
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
            this.logAndThrowError("Error during rating insertion:", error);
        }
    }

    public async getAllComments(bookID: string): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/comment/get_all_comments?book_id=${bookID}`;
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch comments for book ${bookID}. Status: ${response.status}`);
    
            const comments = await response.json(); // The response is expected to be a JSON array of comments
            return comments; // Return the array of comments
        } catch (error) {
            this.logAndThrowError(`Error fetching comments for book ${bookID}:`, error);
        }
    }

    public async retrieveAllComments(bookID: string): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/comment/retrieve_all_comments?book_id=${bookID}`;
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch comments for book ${bookID}. Status: ${response.status}`);
    
            const comments = await response.json(); // The response is expected to be a JSON array of comments
            return comments; // Return the array of comments
        } catch (error) {
            this.logAndThrowError(`Error fetching comments for book ${bookID}:`, error);
        }
    }

    public async createComment(bookID: string, content: string): Promise<any> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/comment/create`;
    
        const body = {
            book_id: bookID,        // The book ID the comment is associated with
            content: content,       // The content of the comment
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
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
            this.logAndThrowError("Error during comment creation:", error);
        }
    }

    public async replyToComment(bookID: string, content: string, repliedCommentID: number): Promise<any> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/comment/reply`; 
    
        const body = {
            book_id: bookID,                        // The book ID associated with the reply
            content: content,                       // The content of the reply
            replied_comment_id: repliedCommentID,   // The ID of the comment being replied to
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
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
            this.logAndThrowError("Error during reply creation:", error);
        }
    }

    public async getContentPages(bookID: number, pageCapacity: number, maximumLineLength: number): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/book/get_all_book_pages/${bookID}/${pageCapacity}/${maximumLineLength}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Ensure the response is OK
            if (!response.ok) 
                throw new Error(`Error fetching pages: ${response.statusText}`);
    
            const data = await response.json();
            return data; // Return the fetched pages data
    
        } catch (error) {
            this.logAndThrowError("Error fetching content pages:", error);
        }
    }

    public async getUserUploadedBooks(): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/book/mylib`;
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch user-uploaded books. Status: ${response.status}`);
    
            const books = await response.json(); // The response is expected to be a JSON array of books
            return books; // Return the array of user-uploaded books
        } catch (error) {
            this.logAndThrowError("Error fetching user-uploaded books:", error);
        }
    }

    public async deleteBook(bookID: string): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `/book/${bookID}`;
    
        try {
            const response = await fetch(`${this.host}${url}`, {
                method: "DELETE",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) {
                console.error(
                    `Failed to delete book ${bookID}. HTTP status: ${response.status}, message: ${response.statusText}`
                );
                throw new Error(`Failed to delete book: ${response.statusText} (${response.status})`);
            }
    
            console.log(`Book ${bookID} deleted successfully.`);
        } catch (error) {
            this.logAndThrowError(`Error deleting book ${bookID}:`, error);
        }
    }

    public async uploadBook(book: any): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/book/create`; 
        const sessionToken = this.findSessionToken();
    
        const formData = new FormData();
        formData.append("title", book.title);
        formData.append("author", book.author);
        formData.append("summary", book.summary);
        formData.append("genre", book.genre);
        
        if (book.content instanceof File) 
            formData.append("content", book.content); // Attach the book's content file
        else 
            throw new Error("Invalid content file. Ensure the content is a valid file.");
        
        if (book.image instanceof File) 
            formData.append("image", book.image); 
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sessionToken}`, // Authorization header with JWT token
                },
                body: formData, // Use FormData as the request body
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error uploading book:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to upload book.");
            }
    
            const result = await response.json(); // Handle the response data if needed
            console.log("Book uploaded successfully:", result);
        } catch (error) {
            this.logAndThrowError("Error during book upload:", error);
        }
    }

    public async updateBook(book: any): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/book/${book.book_id}`; 
        const sessionToken = this.findSessionToken();
    
        const formData = new FormData();
        
        if (book.title) 
            formData.append("title", book.title);
    
        if (book.author) 
            formData.append("author", book.author);
    
        if (book.summary) 
            formData.append("summary", book.summary);
    
        if (book.genre) 
            formData.append("genre", book.genre);
    
        if (book.content instanceof File) 
            formData.append("content", book.content);
    
        if (book.image instanceof File) 
            formData.append("image", book.image);
    
        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${sessionToken}`, // Add JWT authorization header
                },
                body: formData, // Send the FormData as the body of the request
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error updating book:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to update book.");
            }
    
            const result = await response.json(); // Handle response if needed
            console.log("Book updated successfully:", result);
        } catch (error) {
            this.logAndThrowError("Error during book update:", error);
        }
    }

    public async getUserUploadedSampleAudioFiles(): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/sample_audio_file/uploaded_files`; 
        const sessionToken = this.findSessionToken(); // Get the session token (JWT)
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionToken}`, // Pass the JWT token in the Authorization header
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching uploaded sample audio files:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to fetch uploaded sample audio files.");
            }
    
            const result = await response.json(); // Parse the response body as JSON
            console.log("Fetched uploaded sample audio files:", result);

            const finalResult = result.map((file: any) => ({
                ...file,
                content: file.content 
                    ? `data:audio/${file.file_extension};base64,${file.content}`
                    : null,
            }));

            console.log(finalResult);
    
            return finalResult; // Return the list of uploaded sample audio files
    
        } catch (error) {
            this.logAndThrowError("Error during fetching uploaded sample audio files:", error);
        }
    }

    public async uploadSampleAudioFile(record: any): Promise<any> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/sample_audio_file/upload`;
    
        const fileToBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file); // Read the file as a Data URL (base64)
                reader.onload = () => resolve(reader.result as string); // Resolve the base64 string
                reader.onerror = (error) => reject(error); // Handle errors during reading
            });
        }

        try {
            // Convert the file to base64
            const base64Content = await fileToBase64(record.content);

            // Create the payload
            const payload = {
                file_name: record.file_name,
                description: record.description,
                content: base64Content.split(",")[1], // Extract the base64-encoded data without the prefix
                file_extension: record.content.type.split("/")[1], // Extract the file extension
            };
    
            // Send the POST request
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
                body: JSON.stringify(payload),
            });
    
            // Check for errors
            if (!response.ok) {
                const errorData = await response.json();
                this.logAndThrowError("Error uploading sample audio file:", errorData.message || "Unknown error");
            }
    
            console.log("Sample audio file uploaded successfully.");
    
            return await response.json(); // Return the response data if needed
        } catch (error) {
            this.logAndThrowError("Error during file upload:", error);
        }
    }

    public async deleteUploadedSampleAdudioFile(fileID: number): Promise<void> {
        if (!this.host)
            throw new Error("Host is not initialized.");
        
        const url = `${this.host}/sample_audio_file/delete`;
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
                body: JSON.stringify({
                    sample_audio_file_id: fileID // Include the file ID in the request body
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                this.logAndThrowError("Error deleting sample audio file", errorData.message || "Unknown error");
            }
    
            console.log(`Sample audio file with ID ${fileID} deleted successfully.`);
    
        } catch (error) {
            this.logAndThrowError("Error during deleting sample audio file", error);
        }
    }

    private logAndThrowError(contextMessage: string, error: any): never {
        console.error(`${contextMessage}:`, error);
        throw new Error(error.message || "An unexpected error occurred.");
    }

    public async updateSampleAudioFile(record: any): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/sample_audio_file/update/meta_information`;
    
        const body = {
            sample_audio_file_id: record.sample_audio_file_id,
            file_name: record.file_name,
            description: record.description,
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
                body: JSON.stringify(body), // Send JSON data
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error updating sample audio file:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to update sample audio file.");
            }
    
            const result = await response.json(); // Handle response if needed
            console.log("Sample audio file updated successfully:", result);
        } catch (error) {
            this.logAndThrowError("Error during sample audio file update:", error);
        }
    }

    public async toggleBookVisibility(bookID: string): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
        
        const url = `${this.host}/book/visibility/toggle/${bookID}`;
        
        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: this.getSimpleHeadersWithSessionToken(), // Use method to get headers with session token
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error toggling book visibility:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to toggle book visibility.");
            }
    
            const result = await response.json(); // Parse response JSON
            console.log("Book visibility toggled successfully:", result);
        } catch (error) {
            this.logAndThrowError("Error during book visibility toggle:", error);
        }
    }

    public async getAllUserAccounts(): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/account/user/all`;
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch user accounts. Status: ${response.status}`);
    
            const accounts = await response.json(); // The response is expected to be a JSON array of accounts
      
            return accounts.data; 
        } catch (error) {
            this.logAndThrowError("Error fetching user accounts:", error);
        }
    }

    public async getAllUserAccountsForManagementPurpose(): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/user_account_management/user/all`;
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });
    
            if (!response.ok) 
                throw new Error(`Failed to fetch user accounts. Status: ${response.status}`);
    
            const accounts = await response.json(); // The response is expected to be a JSON array of accounts
      
            return accounts.data; 
        } catch (error) {
            this.logAndThrowError("Error fetching user accounts:", error);
        }
    }

    public async banUserAccountPermanently(banned_account_id: number): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");
    
        const url = `${this.host}/user_account_management/ban/permanently`;
    
        const body = {
            banned_account_id,
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
                body: JSON.stringify(body),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error permanently banning user account:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to permanently ban user account.");
            }
    
            console.log("User account permanently banned successfully.");
        } catch (error) {
            this.logAndThrowError("Error during permanent ban of user account:", error);
        }
    }

    public async banUserAccountTemporarily(banned_account_id: number, from: string, to: string): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");

        const url = `${this.host}/user_account_management/ban/temporarily/period`;

        const body = {
            banned_account_id,
            start_time: {
                day: parseInt(from.split("-")[2], 10),
                month: parseInt(from.split("-")[1], 10),
                year: parseInt(from.split("-")[0], 10),
                hour: 0,
                minute: 0,
                second: 0,
            },
            end_time: {
                day: parseInt(to.split("-")[2], 10),
                month: parseInt(to.split("-")[1], 10),
                year: parseInt(to.split("-")[0], 10),
                hour: 23,
                minute: 59,
                second: 59,
            },
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error temporarily banning user account:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to temporarily ban user account.");
            }

            console.log("User account temporarily banned successfully.");
        } catch (error) {
            this.logAndThrowError("Error during temporary ban of user account:", error);
        }
    }

    public async unbanUserAccount(banned_account_id: number): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");

        const url = `${this.host}/user_account_management/unban`;

        const body = {
            banned_account_id,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error unbanning user account:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to unban user account.");
            }

            console.log("User account unbanned successfully.");
        } catch (error) {
            this.logAndThrowError("Error during unban of user account:", error);
        }
    }

    public async trackProgressOfReadingBook(bookID: number, pageNumber: number | null, status: string): Promise<void> {
        if (!this.host) 
            throw new Error("Host is not initialized.");

        const url = `${this.host}/statistics/track_progress`;

        const body = {
            book_id: bookID,
            page_number: pageNumber,
            status: status,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: this.getSimpleHeadersWithSessionToken(),
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error tracking reading progress:", errorData.message || "Unknown error");
                throw new Error(errorData.message || "Failed to track reading progress.");
            }

            console.log("Reading progress tracked successfully.");
        } catch (error) {
            this.logAndThrowError("Error during tracking reading progress:", error);
        }
    }

    public async getAllUserReadingProgress(): Promise<any[]> {
        if (!this.host) 
            throw new Error("Host is not initialized.");

        const url = `${this.host}/statistics/tracked_progress/all`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: this.getSimpleHeadersWithSessionToken(),
            });

            if (!response.ok) 
                throw new Error(`Failed to fetch reading progress. Status: ${response.status}`);

            const progress = await response.json(); // The response is expected to be a JSON array of reading progress

            return progress.data; // Return the array of reading progress
        } catch (error) {
            this.logAndThrowError("Error fetching reading progress:", error);
        }
    }
}
