import logo from "./logo.svg";
import "./App.css";
import { useContext } from "react";
import { DonutContext } from "./context/context";

function App() {
  const { currentAccount } = useContext(DonutContext);

  return (
    <div className="App">
      <header className="App-header">
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
        {currentAccount.isUser ? "" : <button>register</button>}
      </header>
    </div>
  );
}

export default App;
