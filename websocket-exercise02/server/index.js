const express = require("express")
const http = require("http")
const cors = require("cors")
const app = express();
app.use(cors())

const httpServer = http.createServer(app);
app.get("/test", (req, res) => {
    res.send({ msg: "http server is running properly" })
})


// define websocket connection
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");
const url = require("url");
const wss = new WebSocketServer({ server: httpServer })
let clients = {}
//broadcast message to all connected clients
function broadcastMessage(message, senderWebSocket) {
    wss.clients.forEach((client) => {
        if (client !== senderWebSocket && client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        }
    })
}
// handle when client send message
function handleMessage(message, id, senderWebSocket) {
    try {
        const parsedMessage = JSON.parse(message.toString());
        const replyMessage = { type: "drawing", data: parsedMessage.data }
        broadcastMessage(replyMessage,senderWebSocket);
    } catch (error) {
        console.log("Error parsing message:", error);
    }
}
// handle when client left the board
function handleCloseConnection(id, senderWebSocket) {
    const closeMessage = {
        type: "closed",
        data: `${clients[id].username} left the collab tool`
    }
    // console.log("left the chat : ", closeMessage)
    broadcastMessage(closeMessage, senderWebSocket);
    delete clients[id];
}
wss.on("connection", (ws, request) => {
    const parsedQueryObject = url.parse(request.url, true).query;
    const id = uuidv4();
    clients[id] = {
        username: parsedQueryObject.username,
    }
    console.log(`${clients[id].username} joined the connection`)
    let msg = {
        type: "joined",
        data: `${clients[id].username} joined the connection`
    }
    broadcastMessage(msg, ws);
    ws.on("message", (message) => {
        return handleMessage(message, id, ws);
    })

    ws.on("close", () => {
        return handleCloseConnection(id, ws);
    })
    ws.on("error", (error) => {
        console.log("something is wrong : ", error);
    })
})











const port = 5000;
httpServer.listen(port, () => {
    console.log(`server is listening at ${port}`);
})

