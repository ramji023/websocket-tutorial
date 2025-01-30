import { useState } from "react";
import "./room.css";
import { v4 as uuidv4 } from "uuid";
const Login = ({ setUser, setNewRoomId, setJoinRoomId }) => {
    const [formActive, setFormActive] = useState(true);
    const [username, setUsername] = useState("");
    const [joinLink, setJoinLink] = useState("");
    // when user enter their name
    function handleSubmit(e) {
        e.preventDefault();
        if (username) {
            setUser(username);
        }
        setFormActive(false);
    }

    // when user click to create new button
    function handleCreateRoom() {
        const id = uuidv4();
        if (id) {
            setNewRoomId(id);
        }
    }

    // when user click to join room button
    function handleJoinRoom() {
        if (joinLink) {
            setJoinRoomId(joinLink);
        }
    }

    return (
        <>
            {formActive
                ? <>
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={username} placeholder="enter your name" onChange={(e) => setUsername(e.target.value)} />
                        <input type="submit" />
                    </form>
                </>
                : (<>
                    <h1 id="username">Welcome, {username}</h1>
                    <button onClick={handleCreateRoom}>create new room</button>
                    <div className="container">
                        <input type="text" value={joinLink} onChange={(e) => setJoinLink(e.target.value)} placeholder="enter the join code" />
                        <button onClick={handleJoinRoom}>join room</button>
                    </div>

                </>)}


            {/* {username && <>
                
            </>
            } */}
        </>
    )
}

export default Login;