import Logo from "../../images/logo.png";
import React, { useContext, useEffect, useState } from "react";
import { DonutContext } from "../../context/context";
import { shortenAddress } from "../../utils/shortenAddress";
import {
  Button,
  Container,
  Dropdown,
  Nav,
  Navbar,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
const DonutNavBar = () => {
  const {
    connectMetamask,
    currentAccount,
    register,
    unregister,
    activateBox,
    deactivateBox,
  } = useContext(DonutContext);

  const dropdown = (
    <Dropdown align={"end"}>
      <Dropdown.Toggle variant="dark">My Account</Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header style={{ fontSize: "1.5rem" }}>
          Hello, {shortenAddress(currentAccount.address)}{" "}
          <img
            src={"https://source.boringavatars.com/"}
            alt="avatar"
            width={32}
            height={32}
          />
        </Dropdown.Header>
        <Dropdown.Item
          onClick={currentAccount.box.state ? deactivateBox : activateBox}
        >
          {`📦 ${currentAccount.box.state ? "activated" : "deactivated"}`}
        </Dropdown.Item>
        <Dropdown.Item disabled={!currentAccount.box.state}>
          💰{" "}
          {`${ethers.utils.formatUnits(currentAccount.box.balance, "ether")}`}{" "}
          eth
        </Dropdown.Item>
        <Dropdown.Divider />
        {currentAccount.isUser ? (
          <Dropdown.Item
            onClick={unregister}
            style={{ color: "red" }}
            as={Button}
          >
            Unregister
          </Dropdown.Item>
        ) : (
          <Dropdown.Item onClick={register} style={{ color: "green" }}>
            Register
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );

  const connectBtn = (
    <Button variant="dark" onClick={connectMetamask}>
      Connect Wallet
    </Button>
  );

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link to={"/"}>
            <img src={Logo} alt="logo" width={64} height={64} />
          </Link>
        </Navbar.Brand>
        {currentAccount.address ? <Nav>{dropdown}</Nav> : connectBtn}
      </Container>
    </Navbar>
  );
};

export default DonutNavBar;
