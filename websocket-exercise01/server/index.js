const express = require("express")
const cors = require("cors");
const app = express();
app.use(cors());
const http = require("http")
const httpServer = http.createServer(app);
app.get("/", (req, res) => {
    return res.send({ msg: "http server is properly running..." })
})

const { v4: uuidv4 } = require("uuid");
const { WebSocketServer } = require("ws");
const url = require("url");
const wss = new WebSocketServer({ server: httpServer });



const users = {};
//handle brodcast message utility
const broadcastMessage = (message, senderWebSocketInstance) => {
    wss.clients.forEach((client) => {
        if (client !== senderWebSocketInstance && client.readyState === client.OPEN) {
            client.send(JSON.stringify({ message }))
        }
    })
}
// handle client messages
const handleClientMessage = (message, id, senderWebSocketInstance) => {
    const parsedMessage = JSON.parse(message.toString());
    console.log("client message is : ", parsedMessage);
    console.log("message sent by : ", users[id])
    const replyMessage = `${users[id].username} : ${parsedMessage.message}`
    broadcastMessage(replyMessage, senderWebSocketInstance);
}
// handle close websocket connection utility
const handleCloseConnection = (id, senderWebSocketInstance) => {
    const message = `${users[id].username} : left the websocket connection`
    delete users[id];
    broadcastMessage(message, senderWebSocketInstance);
}
wss.on("connection", (ws, request) => {
    // ws.send("webSocket connection is established!!"); // when someone make a upgrade request to connect on websocket server
    const parsedUrl = url.parse(request.url, true) // parsed the url
    const queryObject = parsedUrl.query; // and get the object data from request
    // if user joind without the username 
    if (queryObject.username === undefined) {
        ws.send("username is required...")
        ws.close();
        return;
    }
    // when new user joined
    const id = uuidv4(); // generate a unique id 
    users[id] = {
        username: queryObject.username,
    }
    broadcastMessage(`${users[id].username} : joined the websocket connection!!`, ws)  // broadcast the message to all websocket active users 


    // when user send any message to websocket server
    ws.on("message", (message) => {
        return handleClientMessage(message, id, ws); // return function to get the user id and user message
    })
    ws.on("close", () => {
        console.log("webSocket connection is lost!!")
        return handleCloseConnection(id, ws)
    })
    ws.on("error", (err) => {
        console.log("websocket error : ", err);
    })
})


const port = 8080;
httpServer.listen(port, () => {
    console.log(`server is litening at ${port}`)
})