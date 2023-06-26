import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function HomePage() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  function createNewRoom(e) {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("New room created");
  }
  function handleRoomIdChange(e) {
    setRoomId(e.target.value);
  }
  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }
  function navigateToEditorPage() {
    if (!roomId || !username) {
      toast.error("room id and username required");
      return;
    }
    navigate(`/editor/${roomId}`, { state: { roomId, username } });
  }

  return (
    <div>
      <h1>hello yay</h1>

      <form>
        <label for="room-id">Room ID:</label>
        <input
          type="text"
          id="room-id"
          name="room-id"
          value={roomId}
          onChange={handleRoomIdChange}
          required
        />

        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          required
        />

        <button onClick={navigateToEditorPage}>join</button>
      </form>

      <a href="" onClick={createNewRoom}>
        create new room
      </a>
    </div>
  );
}

export default HomePage;
