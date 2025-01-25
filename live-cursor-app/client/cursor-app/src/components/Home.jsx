import React, { useEffect, useRef } from 'react';
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
const Home = ({ username }) => {

    const { sendJsonMessage } = useWebSocket("ws://localhost:8000", {
        queryParams: { username }
    })

    const THROTTLE = 50;
    const sendJsonMessageThrottle =useRef( throttle(sendJsonMessage, THROTTLE))
    useEffect(() => {
        window.addEventListener("mousemove", e => {
            sendJsonMessageThrottle.current({
                X:e.clientX,
                Y:e.clientY,
            })
        })
    }, [])
    return (
        <>
            <h1>hello, {username}</h1>
        </>
    )
}

export default Home