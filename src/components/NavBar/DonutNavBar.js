import Logo from "../../images/logo.png";
import React, { useContext } from "react";
import { DonutContext } from "../../context/context";
import { shortenAddress } from "../../utils/shortenAddress";
import {
  Button,
  Container,
  Dropdown,
  Nav,
  Navbar,
  Spinner,
} from "react-bootstrap";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
const DonutNavBar = ({ openWithdrawModal }) => {
  const {
    connectMetamask,
    currentAccount,
    register,
    unregister,
    activateBox,
    deactivateBox,
    isLoading,
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
            width={36}
            height={36}
            style={{ margin: "4px" }}
          />
        </Dropdown.Header>
        {currentAccount.isUser ? (
          <>
            <Dropdown.Item
              onClick={
                currentAccount.box.state.toString() === "1"
                  ? deactivateBox
                  : activateBox
              }
            >
              {`📦 ${
                currentAccount.box.state.toString() === "1"
                  ? "activated"
                  : "deactivated"
              }`}
            </Dropdown.Item>
            <Dropdown.Item
              disabled={currentAccount.box.state.toString() === "0"}
              onClick={openWithdrawModal}
            >
              💰{" "}
              {`${ethers.utils.formatUnits(
                currentAccount.box.balance,
                "ether"
              )}`}{" "}
              eth
            </Dropdown.Item>
          </>
        ) : (
          ""
        )}
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
        {isLoading ? (
          <Button variant="dark" disabled>
            <Spinner as={"span"} size="sm" animation="border" />{" "}
            <span>Loading...</span>
          </Button>
        ) : currentAccount.address ? (
          <Nav>{dropdown}</Nav>
        ) : (
          connectBtn
        )}
      </Container>
    </Navbar>
  );
};

export default DonutNavBar;
