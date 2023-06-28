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

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connection_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      socketRef.current.emit("join", {
        roomId: location.state.roomId,
        username: location.state.username,
      });

      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== location.state.username) {
          toast.success(`${username} joined the room`);
        }
        setClients(clients);
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
  }, []);


  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(location.state.roomId);
      toast.success("room id has been copied to your clipboard")
    }
    catch(e){
      toast.error("could not copy room id");
      console.error(e);
    }
  }

  function leaveRoom(){
    reactNavigator("/");
  }

  return (
    <div>
      <h3>connected : </h3>

      {clients.map((client) => (
        <Client key={client.index} username={client.username} />
      ))}
      <button onClick={copyRoomId}>copy room id</button>
      <button onClick={leaveRoom}>leave</button>
      <hr></hr>

      <Editor />
    </div>
  );
}

export default EditorPage;
