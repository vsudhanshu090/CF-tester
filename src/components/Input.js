import React, { useState, useEffect } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

function Input({ roomId, socketRef, onInputChange }) {
  const [input, setInput] = useState();

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  if (socketRef.current) {
    socketRef.current.on("inputSync", ({ inputInput }) => {
      setInput(inputInput);
    });
  }

  useEffect(() => {
    onInputChange(input);
    if (socketRef.current) {
      socketRef.current.emit("inputChange", { roomId, input });

      socketRef.current.on("inputSync", ({ inputInput }) => {
        setInput(inputInput);
      });
    }
  }, [input]);

  return (
    <>
      <CodeEditor
        value={input}
        placeholder="INPUT HERE"
        onChange={handleInputChange}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#000",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
      <h1>{input}</h1>
    </>
  );
}

export default Input;
