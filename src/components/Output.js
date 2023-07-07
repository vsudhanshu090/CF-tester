import React, { useState, useEffect } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

function Output({ op }) {
  function handleOutputChange(e) {}
  return (
    <>
      <CodeEditor
        value={op}
        placeholder="OUTPUT HERE"
        onChange={handleOutputChange}
        padding={15}
        style={{
          height: "215px",
          fontSize: 15,
          backgroundColor: "#000",
          fontFamily: "Consolas",
        }}
      />
    </>
  );
}

export default Output;
