import React, { useState, useEffect } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import Select from "react-select";
import Checkbox from "react-custom-checkbox";
import "../pages/EditorPageStyles.css";

function Editor({ roomId, socketRef, onCodeChange, onLangChange,onInputRequiredChange }) {
  const [code, setCode] = useState();
  const [inputRequired, setInputRequired] = useState(false);

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
      <div className="e-language-grid">
        <div className="e-left-side">
          <h2 className="e-choose-language">
            Choose a Language of your preference :{" "}
          </h2>
        </div>
        <div className="e-right-side">
          <Select
            value={lang}
            onChange={handleOptionChange}
            options={options}
            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary25: "gray",
                primary: "black",
              },
              width: "120px",
            })}
            styles={{
              dropdownIndicator: (styles) => ({
                ...styles,
                height: "15px",
                marginTop: "-25px",
              }),
              menu: (defaultStyles) => ({
                ...defaultStyles,
                width: "120px",
              }),
              control: (defaultStyles) => ({
                ...defaultStyles,
                backgroundColor: "white",
                fontSize: "15px",
                fontFamily: "Work Sans",
                height: "30px",
                minHeight: "15px",
                width: "120px",
              }),
              option: (defaultStyles, state) => ({
                ...defaultStyles,
                borderBottom: "2px thick brown",
                fontSize: "15px",
                fontFamily: "Work Sans",
                width: "120px",
                margin: "auto",
              }),
            }}
          />
        </div>
        <div className="moreright">
          <Checkbox
            label="Do you want to compile with input?"
            labelStyle={{
              color: "#fff",
              marginLeft: 5,
              userSelect: "none",
              fontFamily: "Nobile",
              fontSize: 15,
            }}
            checked={inputRequired}
            onChange={(value, event) => {
              setInputRequired(value);
              onInputRequiredChange(value);
            }}
          />
        </div>
      </div>
      <CodeEditor
        value={code}
        language={lang.value}
        placeholder="Edit your code here!"
        onChange={handleCodeChange}
        padding={15}
        style={{
          height: "392px",
          fontSize: 15,
          backgroundColor: "#000",
          fontFamily: "Consolas",
        }}
      />
    </>
  );
}

export default Editor;
