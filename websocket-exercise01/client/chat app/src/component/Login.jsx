import { useState } from "react";

const Login = ({ setUserName }) => {
    const [username, setUsername] = useState("");
    function handleSubmitForm(e) {
        e.preventDefault();
        setUserName(username);
    }
    return (
        <>
            <form onSubmit={handleSubmitForm}>
                <input
                    type="text"
                    placeholder="enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input type="submit" />
            </form>
        </>
    )
}

export default Login;