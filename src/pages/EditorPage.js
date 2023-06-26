import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { initSocket } from "../socket.js";
import Client from "../components/Client.js";
import Editor from "../components/Editor.js";
import toast from "react-hot-toast";

function EditorPage() {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();

  function handleErrors(e) {
    console.log("socket error", e);
    toast.error("Socket connection failed");
    reactNavigator("/");
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connection_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      socketRef.current.emit("join", {
        roomId: location.state.roomId,
        username: location.state.username,
      });

      socketRef.current.on("joined", ({clients,username,socketId}) => {
        console.log("hi");
        if (username !== location.state.username){
          toast.success(`${username} joined the room`);
        }
        setClients(clients);
      })
    };
    init();
  }, []);

  const [clients, setClients] = useState([]);

  return (
    <div>
      <h3>connected : </h3>

      {clients.map((client) => (
        <Client key={client.index} username={client.username} />
      ))}
      <button>copy room id</button>
      <button>leave</button>
      <hr></hr>

      <Editor />
    </div>
  );
}

export default EditorPage;
