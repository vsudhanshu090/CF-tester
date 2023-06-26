import React, { useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

function Editor() {
    const [code, setCode] = React.useState(
      `function add(a, b) {\n  return a + b;\n}`
    );
    return (
      <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code."
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#000",
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
    );
  }

export default Editor;
