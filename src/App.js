import "./App.css";
import { useContext } from "react";
import { DonutContext } from "./context/context";

function App() {
  const { currentAccount, register, unregister, users, isLoading } =
    useContext(DonutContext);

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
              ? `box state: ${currentAccount.box.state}`
              : ``}
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
