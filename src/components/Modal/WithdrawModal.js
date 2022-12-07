import React, { useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DonutContext } from "../../context/context";

const WithdrawModal = ({ showWithdrawModal, closeWithdrawModal }) => {
  const { currentAccount, withdrawBalance, withdrawAmount, setWithdrawAmount } =
    useContext(DonutContext);

  const withdrawForm = (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        await withdrawBalance();
        setWithdrawAmount(0);
        closeWithdrawModal();
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Amount to withdraw</Form.Label>
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
      <Button
        variant="primary"
        type="submit"
        disabled={currentAccount.box.balance.toString() === "0"}
      >
        Withdraw
      </Button>
    </Form>
  );

  return (
    <Modal show={showWithdrawModal} onHide={closeWithdrawModal}>
      <Modal.Header closeButton>
        <Modal.Title>Withdraw Balance</Modal.Title>
      </Modal.Header>
      <Modal.Body>{withdrawForm}</Modal.Body>
    </Modal>
  );
};

export default WithdrawModal;
