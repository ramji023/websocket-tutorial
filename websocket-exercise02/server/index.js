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

// //broadcast message to all connected clients
// function broadcastMessage(message, senderWebSocket) {
//     wss.clients.forEach((client) => {
//         if (client !== senderWebSocket && client.readyState === client.OPEN) {
//             client.send(JSON.stringify(message));
//         }
//     })
// }
// // handle when client send message
// function handleMessage(message, id, senderWebSocket) {
//     try {
//         const parsedMessage = JSON.parse(message.toString());
//         const replyMessage = { type: "drawing", data: parsedMessage.data }
//         broadcastMessage(replyMessage, senderWebSocket);
//     } catch (error) {
//         console.log("Error parsing message:", error);
//     }
// }

// handle when client left the board
// function handleCloseConnection(id, senderWebSocket) {
//     const closeMessage = {
//         type: "closed",
//         data: `${clients[id].username} left the collab tool`
//     }
//     // console.log("left the chat : ", closeMessage)
//     broadcastMessage(closeMessage, senderWebSocket);
//     delete clients[id];
// }


// broadcast message to this room :  {
//     host: 'alex',
//     roomId: '8e1b18b3-1b27-4eb6-9840-c83a833aa019',
//     joinedUser: [
//       { user: 'alex', websocketInstance: [WebSocket] },
//       { user: 'deepak', websocketInstance: [WebSocket] },
//       { user: 'zesicca', websocketInstance: [WebSocket] }
//     ]
//   }


//broadcast message to selected rooms
function broadcasting(message, roomId) {
    console.log("broadcast this message : ", message);
    const roomData = websocektConnections.find((rooms, index) => rooms.roomId === roomId);
    console.log("broadcast message to this room : ", roomData);
    roomData.joinedUser.forEach((users) => {
        if (users.websocketInstance.readyState === users.websocketInstance.OPEN) {
            users.websocketInstance.send(JSON.stringify(message));
        }
    })
}

// when client send messages
function handleClientMessage(message, roomID) {
    try {
        const parsedMessage = JSON.parse(message.toString());
        const replyMessage = { type: "drawing", data: parsedMessage.data }
        broadcasting(replyMessage, roomID)
    } catch (error) {
        console.log("Error parsing message:", error);
    }
}
// when client close the connection
function handleClientCloseConnection(clientData, ws) {
    console.log("close the connection", clientData);
    // const msg = {
    //     type: "closed",
    //     data: `${clientData.username} left the Collab tool`
    // }
    const roomData = clientData.joinRoom ? clientData.joinRoom : clientData.newRoom;
    console.log("room id is : ", roomData)
    // broadcasting(msg, roomData);

    const roomIndex = websocektConnections.findIndex((rooms) => rooms.roomId === roomData)
    console.log("room index is : ", roomIndex)
    if (roomIndex === -1) return;
    const roomObject = websocektConnections[roomIndex];
    console.log("close room object is : ", roomObject)
    //if host leave the collab tool
    if (roomObject.host === clientData.username) {
        const closeMsg = {
            type: "room_closed",
            data: "Host has left. Redirecting to login...",
        };
        broadcasting(closeMsg, roomData);  // broadcast this message to all connected clients
        websocektConnections.splice(roomIndex, 1);
        console.log(`Room ${roomData} deleted because host left.`);
        return;
    }

    const userIndex = roomObject.joinedUser.findIndex(
        userObj => userObj.user === clientData.username && userObj.websocketInstance === ws
    );

    if (userIndex !== -1) {
        const msg = {
            type: "closed",
            data: `${clientData.username} left the Collab tool`
        }
        broadcasting(msg, roomData);
        roomObject.joinedUser.splice(userIndex, 1);
        console.log(`${clientData.username} removed from room ${roomData}`);
    }

}

// close the connection [Object: null prototype] {
//     joinRoom: '6471c8a4-b752-47e2-b428-0ed724093db9',
//     username: 'Bob'
//   }
let clients = {};
let websocektConnections = [];   // store all the rooms data
wss.on("connection", (ws, request) => {
    const parsedQueryObject = url.parse(request.url, true).query;
    // console.log("parsed Object from client side : ", parsedQueryObject);
    //when user create room
    if (parsedQueryObject.newRoom) {
        const newObject = {
            host: parsedQueryObject.username,
            roomId: parsedQueryObject.newRoom,
            joinedUser: [{ user: parsedQueryObject.username, websocketInstance: ws }]
        }
        websocektConnections.push(newObject);
        // console.log("new room created successfully", websocektConnections);
    }
    //when user join room
    if (parsedQueryObject.joinRoom) {
        const checkRoomId = websocektConnections.find((rooms, index) => rooms.roomId === parsedQueryObject.joinRoom);
        if (checkRoomId) {
            checkRoomId.joinedUser.push({ user: parsedQueryObject.username, websocketInstance: ws });
        }
        // console.log("joined someone this room : ", websocektConnections);
        const msg = {
            type: "joined",
            data: `${parsedQueryObject.username} joined the collab tool`
        }
        broadcasting(msg, parsedQueryObject.joinRoom);
    }

    ws.on("message", (message) => {
        const roomId = parsedQueryObject.joinRoom ? parsedQueryObject.joinRoom : parsedQueryObject.newRoom;
        return handleClientMessage(message, roomId);
    })

    ws.on("close", () => {
        return handleClientCloseConnection(parsedQueryObject, ws);
    })



    // const id = uuidv4();
    // clients[id] = {
    //     username: parsedQueryObject.username,
    // }
    // console.log(`${clients[id].username} joined the connection`)
    // let msg = {
    //     type: "joined",
    //     data: `${clients[id].username} joined the connection`
    // }
    // broadcastMessage(msg, ws);
    // ws.on("message", (message) => {
    //     return handleMessage(message, id, ws);
    // })
    // ws.on("close", () => {
    //     return handleCloseConnection(id, ws);
    // })
    ws.on("error", (error) => {
        console.log("something is wrong : ", error);
    })
})


// parsed Object from client side :  [Object: null prototype] {
//     newRoom: '7ffdcb27-8947-4920-a8ed-5b315742a5a0',
//     username: 'alexcarry'
//   }
//   alexcarry joined the connection
//   parsed Object from client side :  [Object: null prototype] {
//     joinRoom: '7ffdcb27-8947-4920-a8ed-5b315742a5a0',
//     username: 'zessicca'
//   }



const port = 5000;
httpServer.listen(port, () => {
    console.log(`server is listening at ${port}`);
})

