import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import SupportForm from "../components/Form/SupportForm";
import { SupportList } from "../components/List/SupportList";
import { DonutContext } from "../context/context";

const UserInfo = () => {
  const { addr } = useParams();
  const navigation = useNavigate();
  const { checkIfRegisteredUser } = useContext(DonutContext);

  useEffect(() => {
    try {
      checkIfRegisteredUser(addr)
        .then((res) => {
          if (!res) {
            navigation("/");
          }
        })
        .catch((err) => {
          navigation("/");
        });
    } catch (err) {
      navigation("/");
      console.log(err);
    }
  }, [addr, checkIfRegisteredUser, navigation]);

  return (
    <Container>
      <Row>
        <Col>
          <SupportList addr={addr} />
        </Col>
        <Col>
          <SupportForm addr={addr} />
        </Col>
      </Row>
    </Container>
  );
};

export default UserInfo;
