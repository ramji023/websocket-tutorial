import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const Home = ({ user }) => {

    const [messageHistory, setMessageHistory] = useState([]); // store all the messages
    const socketUrl = `ws://localhost:8080?username=${user}`;
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl)

    // check if there is any message got from server
    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log("last message is : ", lastJsonMessage.message);
            const msg = lastJsonMessage.message;
            setMessageHistory((prev) => {
                return [...prev, msg];
            })
        }
    }, [lastJsonMessage])

    // send the message to server
    const submitMessage = (e) => {
        e.preventDefault();
        // Create the JSON object 
        if (msg.trim() !== "") {
            const messageObject = {
                message: msg,
            };
            sendJsonMessage(messageObject);
            setMsg("");
        }
    }
    const [msg, setMsg] = useState("");
    return (
        <>
            <h1>Welcome , {user}</h1>
            <form onSubmit={submitMessage}>
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="write your message"
                />
                <input type="submit" disabled={readyState !== 1}/>
            </form>
            {messageHistory.length === 0 ? (<p>There is no message</p>) : (
                <>
                    {messageHistory.map((message, index) => (
                        <div key={index}>
                            <p>{message}</p>
                        </div>
                    ))}
                </>
            )}
        </>
    )
}

export default Home;