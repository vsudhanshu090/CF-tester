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
          height: "175px",
          fontSize: 15,
          backgroundColor: "#000",
          fontFamily:
            "Consolas",
        }}
      />
    </>
  );
}

export default Input;
