import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import "./HomePageStyles.css";

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
      toast.error("Room ID and username are required");
      return;
    }
    navigate(`/editor/${roomId}`, { state: { roomId, username } });
  }

  return (
    <div className="container">
      <div className="grid-container">
        <div className="left-side">
          <h1 className="title">CoWrite IDE</h1>
          <h3 className="description">Your friendly real-time code editor</h3>
        </div>
        <div className="separator"></div> {/* Add separator */}
        <div className="right-side">
          <form>
            <div className="form-row">
              <input
                class="inputArea"
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={handleRoomIdChange}
                required
              />
            </div>

            <div className="form-row">
              <input
                class="inputArea"
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>

            <div className="button-container">
              <button className="join-button" onClick={navigateToEditorPage}>
                Join
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="collaborate-container">
        <p className="collaborate-text">
          Don't have a room? <br />
          Start Collaborating and Experience Seamless Real-Time Code Editing
        </p>
        <a className="create-room-link" href="#" onClick={createNewRoom}>
          Create a Room!
        </a>
      </div>
    </div>
  );
}

export default HomePage;
