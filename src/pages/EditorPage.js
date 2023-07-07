import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { initSocket } from "../socket.js";
import Client from "../components/Client.js";
import Editor from "../components/Editor.js";
import Input from "../components/Input.js";
import toast from "react-hot-toast";

function EditorPage() {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const langRef = useRef({ value: "cpp", label: "C++" });
  const inputRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();

  const [output, setOutput] = useState("");

  function handleErrors(e) {
    console.log("socket error", e);
    toast.error("Socket connection failed");
    reactNavigator("/");
  }

  function handleCodeSubmit() {
    const lang = langRef.current.value;

    if (lang === "cpp") {
      socketRef.current.emit("submitcpp", {
        code: codeRef.current,
        roomId: location.state.roomId,
      });
    } else if (lang === "python") {
      socketRef.current.emit("submitpy", {
        code: codeRef.current,
        roomId: location.state.roomId,
      });
    } else if (lang === "c") {
      socketRef.current.emit("submitcpp", {
        code: codeRef.current,
        roomId: location.state.roomId,
      });
    }
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

        socketRef.current.emit("firstJoinCodeSync", {
          code: codeRef.current,
          socketId,
        });
        socketRef.current.emit("firstJoinInputSync", {
          input: inputRef.current,
          socketId,
        });
      });

      socketRef.current.on("outputReady", ({ givenOutput }) => {
        setOutput(givenOutput);
        socketRef.current.emit("flushFiles", {});
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

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(location.state.roomId);
      toast.success("room id has been copied to your clipboard");
    } catch (e) {
      toast.error("could not copy room id");
      console.error(e);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  return (
    <>
      <h3>connected : </h3>

      {clients.map((client) => (
        <Client key={client.index} username={client.username} />
      ))}
      <button onClick={copyRoomId}>copy room id</button>
      <button onClick={leaveRoom}>leave</button>
      <hr></hr>

      <Editor
        roomId={location.state.roomId}
        socketRef={socketRef}
        onCodeChange={(code) => {
          codeRef.current = code;
        }}
        onLangChange={(lang) => {
          langRef.current = lang;
        }}
      />
      <Input
        roomId={location.state.roomId}
        socketRef={socketRef}
        onInputChange={(input) => {
          inputRef.current = input;
        }}
      />

      <button onClick={handleCodeSubmit}>submit</button>
      <h1>{output}</h1>
    </>
  );
}

export default EditorPage;
