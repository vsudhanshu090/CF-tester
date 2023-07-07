import React from "react";
import "../pages/EditorPageStyles.css";

function Client(props) {
  return (
    <>
      <h1 className="client-name">{props.username}</h1>
    </>
  );
}

export default Client;
