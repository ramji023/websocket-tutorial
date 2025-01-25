const http = require("http");
const { WebSocketServer } = require("ws");  // import websocket
const httpServer = http.createServer()
const url = require("url");
const uuidv4 = require("uuid").v4;


//established web socket connection

const wss = new WebSocketServer({ server: httpServer })
const connections = {};
const users = {};
const broadcast = () => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid];
        const message = JSON.stringify(users);
        connection.send(message);
    })
}
function handleMessage(bytes, uuid) {
    const message = JSON.parse(bytes.toString());
    console.log(message);
    const user = users[uuid];
    user.state = message;
    broadcast();
}

function handleClose(uuid) {
    console.log(`${users[uuid].username} is disconnected!!`)
    delete connections[uuid];
    delete users[uuid];
    broadcast();
}
wss.on("connection", (connection, request) => {
    //  ws://localhost:8000?username=deepak
    const { username } = url.parse(request.url, true).query;
    console.log(username);
    const uuid = uuidv4();
    console.log(uuid);
    connections[uuid] = connection;
    users[uuid] = {
        username: username,
        state: {}
    }

    connection.on("message", message => handleMessage(message, uuid));
    connection.on("close", () => handleClose(uuid));
})

const port = 8000;
httpServer.listen(port, () => {
    console.log(`websocket server is listening at ${port}`)
})