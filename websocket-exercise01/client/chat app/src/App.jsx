import { useState } from 'react'
import Login from './component/Login'
import Home from './component/Home';
function App() {
  const [user, setUser] = useState("");
  return (
    <>
      {user ? <Home user={user} /> : <Login setUserName={setUser} />}
    </>
  )
}

export default App
