import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import LoadingBtn from "../Button/LoadingBtn";
import { DonutContext } from "../../context/context";
import { shortenAddress } from "../../utils/shortenAddress";

const SupportForm = ({ addr }) => {
  const {
    currentAccount,
    supportDonut,
    setTo,
    donutAmount,
    setDonutAmount,
    message,
    setMessage,
    isLoading,
  } = useContext(DonutContext);

  const donut = ethers.utils.parseEther("0.003");
  const [payment, setPayment] = useState(ethers.BigNumber.from("0"));

  useEffect(() => {
    setTo(addr);
  }, [addr, setTo]);

  const submitForm = (e) => {
    e.preventDefault();
    supportDonut().then(() => {
      setDonutAmount(0);
      setMessage("");
      setPayment(ethers.BigNumber.from("0"));
    });
  };

  return (
    <Form className="mt-3 shadow p-3 bg-white rounded" onSubmit={submitForm}>
      <h3 className="mb-3">
        Buy <span style={{ color: "grey" }}>{shortenAddress(addr)}</span> a
        donut
      </h3>
      <InputGroup className="mb-3">
        <InputGroup.Text>🍩</InputGroup.Text>
        <Form.Control
          placeholder="the number of donut"
          type="number"
          min="1"
          value={donutAmount}
          onChange={(e) => {
            setDonutAmount(e.target.value);
            if (!e.target.value) {
              setPayment(ethers.BigNumber.from("0"));
              return;
            }
            setPayment(ethers.BigNumber.from(e.target.value).mul(donut));
          }}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Say something nice...(optional)"
          rows="4"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </InputGroup>

      {isLoading ? (
        <LoadingBtn />
      ) : (
        <Button
          variant="primary"
          type="submit"
          disabled={addr.toLowerCase() === currentAccount.address}
        >
          Support {ethers.utils.formatEther(payment).toString()} eth
        </Button>
      )}
    </Form>
  );
};

export default SupportForm;
