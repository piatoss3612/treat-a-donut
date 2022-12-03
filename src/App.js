import "./App.css";
import { useContext } from "react";
import { DonutContext } from "./context/context";

function App() {
  const {
    currentAccount,
    register,
    unregister,
    activateBox,
    deactivateBox,
    users,
    isLoading,
  } = useContext(DonutContext);

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
              ? `balance: ${currentAccount.box.balance}`
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
          <ul>
            {users.map((user, idx) => (
              <li key={idx}>{user}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
