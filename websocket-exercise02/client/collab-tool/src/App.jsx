import { useState } from 'react'
import Canvas from './components/Canvas'
import Login from './components/Login'
function App() {
  const [user, setUser] = useState("");
  return (
    <>
      {user ? <Canvas width="800" height="500" user={user} /> : <Login setUser={setUser} />}
    </>
  )
}

export default App
