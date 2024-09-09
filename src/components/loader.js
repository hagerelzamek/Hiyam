import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loader() {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "15px",
        height: "15px",
        margin: "auto",
        display: "block",
        borderWidth: 2,
      }}
    />
  );
}
