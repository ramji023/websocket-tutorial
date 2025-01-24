import http from "node:http";
import { server as WebSocketServer } from "websocket";

let connection = null;

// Create HTTP server
const httpServer = http.createServer((req, res) => {
    console.log("We have received a request.");
    res.end("Hello, World!");
});

// Create WebSocket server
const webSocket = new WebSocketServer({
    httpServer: httpServer, // Attach WebSocket to HTTP server
});

webSocket.on("request", (request) => {
    connection = request.accept(null, request.origin);
    console.log("WebSocket connection accepted.");

    // Send a message to the client
    connection.sendUTF("Welcome to the WebSocket server!");

    // Handle connection open (optional for websocket library)
    connection.on("open", () => {
        console.log("Connection opened!");
    });

    // Handle connection close
    connection.on("close", () => {
        console.log("Connection closed!");
    });

    // Handle incoming messages from the client
    connection.on("message", (message) => {
        if (message.type === "utf8") {
            console.log(`Received message: ${message.utf8Data}`);

            // Echo the message back to the client
            connection.sendUTF(`Server received your message: ${message.utf8Data}`);
        }
    });
});

// Start the server
httpServer.listen(5000, () => {
    console.log("Server is listening on port 5000...");
});
