import React from "react";
import { useContext } from "react";
import { Badge, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DonutContext } from "../../context/context";

const UserList = () => {
  const { users } = useContext(DonutContext);
  return (
    <ListGroup as="ul">
      {users.map((user, idx) => (
        <ListGroup.Item
          key={idx}
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <Link
            to={`user/${user}`}
            className="ms-2 me-auto"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="fw-bold">{user}</div>
            No Description
          </Link>
          <Badge
            bg="white"
            pill
            style={{
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
          >
            💗
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default UserList;
