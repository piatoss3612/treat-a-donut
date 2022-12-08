import TimeAgo from "javascript-time-ago";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Image, ListGroup, Row } from "react-bootstrap";
import { DonutContext } from "../../context/context";
import en from "javascript-time-ago/locale/en";
import { shortenAddress } from "../../utils/shortenAddress";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const SupportList = ({ addr }) => {
  const { loadReceiptsOfBeneficiary, isLoading } = useContext(DonutContext);
  const [supportReceipts, setSupportReceipts] = useState([]);
  const generateRandomAvatar = () => {
    const randomAvatar = Math.floor(Math.random() * 1000);
    return `https://avatars.dicebear.com/api/adventurer/${
      randomAvatar + addr
    }.svg`;
  };

  const listItems = supportReceipts
    .slice(0)
    .reverse()
    .map((receipt, idx) => (
      <ListGroup.Item key={idx}>
        <Container>
          <Row className="m-1">
            <Col lg="auto">
              <Image
                className="m-1"
                src={generateRandomAvatar()}
                alt="random avatar"
                width={48}
              />
            </Col>
            <Col>
              <Row style={{ color: "grey" }}>
                {shortenAddress(receipt.from)} bought{" "}
                {receipt.donuts.toString() === "1"
                  ? "a donut"
                  : `${receipt.donuts.toString()} donuts`}
              </Row>
              <Row style={{ color: "grey" }}>
                {timeAgo.format(
                  new Date(receipt.timestamp.toNumber() * 1000),
                  "mini"
                )}{" "}
                ago
              </Row>
              {receipt.message ? (
                <Row className="mt-2 mb-2">{receipt.message}</Row>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Container>
      </ListGroup.Item>
    ));

  useEffect(() => {
    loadReceiptsOfBeneficiary(addr)
      .then((result) => {
        setSupportReceipts(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [addr, loadReceiptsOfBeneficiary, isLoading]);

  return (
    <div className="mt-3">
      <h3 className="mb-3">Recent supporters</h3>
      <ListGroup className="mt-3 shadow p-3 bg-white rounded">
        {listItems}
      </ListGroup>
    </div>
  );
};
