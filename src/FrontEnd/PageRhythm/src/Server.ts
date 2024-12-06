export default class Server {
    private static instance: Server | null = null;
    private host: string | null = null;
    private sessionToken: string | null = null;

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
                this.sessionToken = data["access_token"]; // Save the session token if login is successful
                console.log("Login successful, session token stored.");
            }
    
            return response;    // Return the pure response object
        } catch (error) {
            console.error("Error during login:", error);
            throw error;        // Rethrow the error to handle it elsewhere
        }
    }

    public getSessionToken(): string | null {
        return this.sessionToken;
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
                this.sessionToken = data["access_token"]; // Save the session token if signup is successful
                console.log("Signup successful, session token stored.");
            }

            return response;    // Return the pure response object
        } catch (error) {
            console.error("Error during signup:", error);
            throw error;        // Rethrow the error to handle it elsewhere
        }
    }

    public async getProfile(): Promise<any> {
        if (!this.host) {
            throw new Error("Host is not initialized.");
        }

        if (!this.sessionToken) {
            throw new Error("Session token is not set.");
        }

        const url = `${this.host}/account/profile`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${this.sessionToken}`,
                },
            });

            if (response.ok) {
                return await response.json();
            }

            throw new Error(`Failed to get profile: ${response.status}`);
        } catch (error) {
            console.error("Error getting profile:", error);
            throw error;
        }
    }
}
