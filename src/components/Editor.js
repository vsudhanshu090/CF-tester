import React, { useState, useEffect } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

function Editor({ roomId, socketRef, onCodeChange }) {
  const [code, setCode] = useState();

  function handleCodeChange(e) {
    setCode(e.target.value);
  }

  if (socketRef.current) {
    socketRef.current.on("codeSync", ({ inputCode }) => {
      setCode(inputCode);
    });
  }

  useEffect(() => {
    onCodeChange(code);
    if (socketRef.current) {
      socketRef.current.emit("codeChange", { roomId, code });

      socketRef.current.on("codeSync", ({ inputCode }) => {
        setCode(inputCode);
      });
    }
  }, [code]);

  return (
    <>
      <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code."
        onChange={handleCodeChange}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#000",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
      <h1>{code}</h1>
    </>
  );
}

export default Editor;
