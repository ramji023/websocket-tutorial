import { useEffect, useMemo, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import "./canvas.css";
const Canvas = (props) => {
    const socketURL = `ws://localhost:5000?username=${props.user}`   // design the websocket url
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketURL);  
    const base64Ref = useRef(null);
    const isDrawingRef = useRef(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isPressed, setIsPressed] = useState(false);
    const [messages, setMessages] = useState([]);  // used to send joining and left messages
    const colors = useMemo(() => {
        return ["black", "green", "red", "blue", "pink", "purple", "yellow", "gray", "orange"]
    }, []);

    // define interval to send updated board data in base64 format
    useEffect(() => {
        const interval = setInterval(() => {
            if (canvasRef.current && isDrawingRef.current) {
                base64Ref.current = canvasRef.current.toDataURL();
                sendJsonMessage({ type: "drawing", data: base64Ref.current });
                isDrawingRef.current = false;
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    
    const clearCanvas = () => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d");
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.width, canvas.height);
        isDrawingRef.current = true;
    }
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')
        context.lineCap = "round"
        context.strokeStyle = colors[0]
        context.lineWidth = 5
        contextRef.current = context

    }, [colors])

    const beginDraw = (e) => {
        contextRef.current.beginPath();
        contextRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        setIsPressed(true);
        isDrawingRef.current = true;
    }

    const endDraw = () => {
        contextRef.current.closePath();
        setIsPressed(false);
    }
    const updateDraw = (e) => {
        if (!isPressed) return;
        contextRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        contextRef.current.stroke();
        isDrawingRef.current = true;
    }
    const handleMouseLeave = () => {
        if (isPressed) {
            endDraw();
        }
    };
    const setColor = (color) => {
        contextRef.current.strokeStyle = color;
    }

    // define function when client receive any messages from client side
    useEffect(() => {
        if (lastJsonMessage) {
            if (lastJsonMessage.type === 'drawing') {
                const img = new Image();
                img.src = lastJsonMessage.data;
                // console.log("received  board data from websocket server : ", lastJsonMessage.data)
                img.onload = () => {
                    const context = canvasRef.current.getContext('2d');
                    context.drawImage(img, 0, 0);
                };
            } else if (lastJsonMessage.type === 'joined' || lastJsonMessage.type === 'closed') {
                // console.log("recieved message data from websocket server : ", lastJsonMessage.data);
                setMessages((prev) => ([...prev, lastJsonMessage.data]))
            }
        }
    }, [lastJsonMessage]);
    return (
        <>
            <h1 id="title">welcome to collab tool</h1>
            <h2 id="username">Welcome , {props.user}</h2>
            <canvas
                ref={canvasRef}
                onMouseDown={beginDraw}
                onMouseUp={endDraw}
                onMouseMove={updateDraw}
                onMouseLeave={handleMouseLeave}
                {...props}
            />
            <div className="button-container">
                <button onClick={clearCanvas}>Clear</button>
                {colors.map((color, index) => (
                    <button
                        key={index}
                        onClick={() => setColor(color)}
                        style={{ backgroundColor: color }}
                    ></button>
                ))}
            </div>
            <div className="messages">
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
        </>
    )
}

export default Canvas;