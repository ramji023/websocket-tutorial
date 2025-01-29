import { useState } from "react";

const Login = ({ setUser }) => {
    const [username, setUsername] = useState("");
    function handleSubmit(e) {
        e.preventDefault();
        if (username) {
            setUser(username);
        }
        setUsername("");
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} placeholder="enter your name" onChange={(e) => setUsername(e.target.value)} />
                <input type="submit" />
            </form>
        </>
    )
}

export default Login;