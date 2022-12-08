import React from "react";
import { Button, Spinner } from "react-bootstrap";

const LoadingBtn = () => {
  return (
    <Button variant="dark" disabled>
      <Spinner as={"span"} size="sm" animation="border" />{" "}
      <span>Loading...</span>
    </Button>
  );
};

export default LoadingBtn;
