import { useState } from 'react'
import Canvas from './components/Canvas'
import Login from './components/Login'
function App() {
  const [user, setUser] = useState(null);
  const [newRoomId, setNewRoomId] = useState(null);
  const [joinRoomId, setJoinRoomId] = useState(null);
console.log("joinRoom id : ",joinRoomId );
  return (
    <>
      {(user && (newRoomId || joinRoomId)) ? <Canvas user={user} newRoom={newRoomId} joinRoom={joinRoomId} setjoinRoomId={setJoinRoomId}/> : <Login setUser={setUser} setNewRoomId={setNewRoomId} setJoinRoomId={setJoinRoomId} />}
    </>
  )
}

export default App


// <Canvas width="800" height="500" user={user} />