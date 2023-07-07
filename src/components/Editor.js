import React, { useState, useEffect } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import Select from "react-select";

function Editor({ roomId, socketRef, onCodeChange , onLangChange}) {
  const [code, setCode] = useState();

  const options = [
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "python", label: "Python" },
  ];

  const [lang, setLang] = useState(options[0]);
  function handleOptionChange(e) {
    setLang(e);
    onLangChange(e);
  }

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
      <Select value={lang} onChange={handleOptionChange} options={options} />
      
      <CodeEditor
        value={code}
        language={lang.value}
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
