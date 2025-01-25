import { useState } from "react";

const Login = ({ onSubmit }) => {
    const [username, setUsername] = useState("");
    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(username);
    }
    return (
        <>
            <h1>Welcome</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    placeholder="enter your name..."
                    onChange={(e) => { setUsername(e.target.value) }}
                />

                <input type="submit" />
            </form>
        </>
    )
}

export default Login;