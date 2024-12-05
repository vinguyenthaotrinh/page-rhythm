class Server {
    private static instance: Server | null = null;
    private host: string | null = null;

    private constructor() {} // Private constructor to prevent direct instantiation

    // Singleton initializer
    public static async getInstance(): Promise<Server> {
        if (Server.instance === null) {
            Server.instance = new Server();
            //https://page-rhythm-back-end.onrender.com"
            // "http://127.0.0.1:5000"
            await Server.instance.initializeHost(null, "http://127.0.0.1:5000");
        }
        return Server.instance;
    }

    // Perform health check or directly set the available host
    private async initializeHost(deployedUrl: string | null, localUrl: string | null): Promise<void> {
        if (deployedUrl === null && localUrl === null) {
            throw new Error("Both deployedUrl and localUrl cannot be null.");
        }

        // If one is null, pick the other without a health check
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

        // Perform health check if both URLs are available
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

    // Get the current host URL
    public getHost(): string | null {
        return this.host;
    }

    // Send a request to the current host
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
}