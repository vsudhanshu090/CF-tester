import React, { useState, useEffect } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { initSocket } from "../socket.js";

function Editor() {
  const [code, setCode] = useState();

  function handleCodeChange() {

  }

  return (
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
  );
}

export default Editor;
