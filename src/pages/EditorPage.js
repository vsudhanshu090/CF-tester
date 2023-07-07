import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { initSocket } from "../socket.js";
import Client from "../components/Client.js";
import Editor from "../components/Editor.js";
import Input from "../components/Input.js";
import Output from "../components/Output.js";
import toast from "react-hot-toast";
import "./EditorPageStyles.css";

function EditorPage() {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const langRef = useRef({ value: "cpp", label: "C++" });
  const inputRef = useRef(null);
  const inputRequiredRef = useRef(false);
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
    const ipReq = inputRequiredRef.current;


    if (ipReq === false) {
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
    else{
      if (lang === "cpp") {
        console.log(inputRef.current);
        socketRef.current.emit("submitcppwithip", {
          code: codeRef.current,
          input: inputRef.current,
          roomId: location.state.roomId,
        });
      } else if (lang === "python") {
        socketRef.current.emit("submitpywithip", {
          code: codeRef.current,
          input: inputRef.current,
          roomId: location.state.roomId,
        });
      } else if (lang === "c") {
        socketRef.current.emit("submitcppwithip", {
          code: codeRef.current,
          input: inputRef.current,
          roomId: location.state.roomId,
        });
      }
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
      toast.success("Room ID has been copied to your clipboard");
    } catch (e) {
      toast.error("Could not copy Room ID");
      console.error(e);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  return (
    <div className="ed-main-container">
      <div className="ed-grid-container">
        <div className="ed-left-side">
          <h1 className="ed-title">CoWrite IDE</h1>
          <hr className="ed-hr" />
          <h3 className="ed-connected-text">Connected-users :</h3>
          <div className="ed-client-list">
            {clients.map((client) => (
              <Client key={client.index} username={client.username} />
            ))}
          </div>
          <button className="ed-copy-button" onClick={copyRoomId}>
            Copy Room ID
          </button>
          <br />
          <button className="ed-leave-button" onClick={leaveRoom}>
            Leave
          </button>
        </div>
        <div className="separator"></div>
        <div className="ed-right-side">
          <Editor
            roomId={location.state.roomId}
            socketRef={socketRef}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
            onLangChange={(lang) => {
              langRef.current = lang;
            }}
            onInputRequiredChange={(inputRequired) => {
              inputRequiredRef.current = inputRequired;
            }}
          />
          <hr />
          <div className="grid-input-output">
            <div className="input-grid">
              <Input
                roomId={location.state.roomId}
                socketRef={socketRef}
                onInputChange={(input) => {
                  inputRef.current = input;
                }}
              />
              <button className="ed-submit-button" onClick={handleCodeSubmit}>
                Submit
              </button>
            </div>
            <div className="separator"></div>
            <div className="output-grid">
              <Output op={output} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
