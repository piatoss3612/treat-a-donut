import { ethers } from "ethers";
import React, { useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { DonutContext } from "../../context/context";
import LoadingBtn from "../Button/LoadingBtn";

const WithdrawForm = ({ closeWithdrawModal }) => {
  const {
    currentAccount,
    withdrawBalance,
    withdrawAmount,
    setWithdrawAmount,
    isLoading,
  } = useContext(DonutContext);

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        await withdrawBalance();
        setWithdrawAmount(0);
        closeWithdrawModal();
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>
          Available:{" "}
          {ethers.utils.formatUnits(currentAccount.box.balance, "ether")} eth
        </Form.Label>
        <Form.Control
          type="number"
          step="any"
          placeholder="Enter amount"
          onChange={(e) => {
            setWithdrawAmount(e.target.value);
          }}
          value={withdrawAmount}
          disabled={currentAccount.box.balance.toString() === "0"}
        />
        <Form.Text className="text-muted">
          Please enter the amount in ether.
        </Form.Text>
      </Form.Group>
      {isLoading ? (
        <LoadingBtn />
      ) : (
        <Button
          variant="primary"
          type="submit"
          disabled={currentAccount.box.balance.toString() === "0"}
        >
          Withdraw
        </Button>
      )}
    </Form>
  );
};

export default WithdrawForm;
