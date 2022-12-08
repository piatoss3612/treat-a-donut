import React from "react";
import { Modal } from "react-bootstrap";
import WithdrawForm from "../Form/WithdrawForm";

const WithdrawModal = ({ showWithdrawModal, closeWithdrawModal }) => {
  return (
    <Modal show={showWithdrawModal} onHide={closeWithdrawModal}>
      <Modal.Header closeButton>
        <Modal.Title>Withdraw Balance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <WithdrawForm closeWithdrawModal={closeWithdrawModal} />
      </Modal.Body>
    </Modal>
  );
};

export default WithdrawModal;
