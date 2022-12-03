import "./App.css";
import { useContext, useState } from "react";
import { DonutContext } from "./context/context";
import { ethers } from "ethers";

function App() {
  const {
    currentAccount,
    register,
    unregister,
    activateBox,
    deactivateBox,
    users,
    supportDonut,
    setTo,
    setDonutAmount,
    setMessage,
    withdrawBalance,
    setWithdrawAmount,
    loadReceiptsOfSupporter,
    loadReceiptsOfBeneficiary,
    isLoading,
  } = useContext(DonutContext);

  const [receiptsOfSupporter, setReceiptsOfSupporter] = useState([]);
  const [receiptsOfBeneficiary, setReceiptsOfBeneficiary] = useState([]);

  return (
    <div className="App">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>{currentAccount.address}</p>
          <p>{`registered: ${currentAccount.isUser}`}</p>
          <p>
            {currentAccount.isUser
              ? `box state: ${
                  currentAccount.box.state ? "activated" : "deactivated"
                }`
              : ""}
          </p>
          <p>
            {currentAccount.isUser
              ? `balance: ${ethers.utils.formatEther(
                  currentAccount.box.balance
                )} eth`
              : ``}
          </p>
          {currentAccount.isUser ? (
            <button onClick={unregister}>unregister</button>
          ) : (
            <button onClick={register}>register</button>
          )}
          {currentAccount.isUser ? (
            currentAccount.box.state === 1 ? (
              <button onClick={deactivateBox}>deactivate</button>
            ) : (
              <button onClick={activateBox}>activate</button>
            )
          ) : (
            ""
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              withdrawBalance();
            }}
            style={{
              border: "1px solid black",
              margin: "1em",
              padding: "1em",
            }}
          >
            <h3>Withdraw Balance</h3>
            <p>
              Amount:
              <input
                type="number"
                step="any"
                onChange={(e) => {
                  setWithdrawAmount(e.target.value);
                }}
              />
              <strong>eth</strong>
            </p>
            <button type="submit">Withdraw</button>
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              supportDonut();
            }}
            style={{
              border: "1px solid black",
              margin: "1em",
              padding: "1em",
            }}
          >
            <h3>Support</h3>
            <p>
              To:
              <input
                type="text"
                onChange={(e) => {
                  setTo(e.target.value);
                }}
              />
            </p>
            <p>
              Amount:
              <input
                type="number"
                onChange={(e) => setDonutAmount(e.target.value)}
              />
            </p>
            <p>
              Message:{" "}
              <input
                type="text"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </p>
            <button type="submit">Support</button>
          </form>
          <ul>
            {users.map((user, idx) => (
              <li key={idx}>{user}</li>
            ))}
          </ul>
          <button
            onClick={async () => {
              const receipts = await loadReceiptsOfSupporter(
                currentAccount.address
              );
              setReceiptsOfSupporter(receipts);
            }}
          >
            Load Supporter Receipts
          </button>
          <ul>
            {receiptsOfSupporter.map((receipt, idx) => (
              <li key={idx} style={{ border: "1px solid black" }}>
                <p>From: {receipt.from}</p>
                <p>To: {receipt.to}</p>
                <p>Amount: {receipt.amount.toString()} donut</p>
                <p>Message: {receipt.message}</p>
              </li>
            ))}
          </ul>
          <button
            onClick={async () => {
              const receipts = await loadReceiptsOfBeneficiary(
                currentAccount.address
              );
              setReceiptsOfBeneficiary(receipts);
            }}
          >
            Load Beneficiary Receipts
          </button>
          <ul>
            {receiptsOfBeneficiary.map((receipt, idx) => (
              <li key={idx} style={{ border: "1px solid black" }}>
                <p>From: {receipt.from}</p>
                <p>To: {receipt.to}</p>
                <p>Amount: {receipt.amount.toString()} donut</p>
                <p>Message: {receipt.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
