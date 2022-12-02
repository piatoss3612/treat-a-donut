import { createContext, useEffect, useState } from "react";
import { ContractAddress, ContractAbi } from "../config/contract";

const { ethereum } = window;

const MetamaskNotDetectedErr = "metamask not detected";
const NoAccountFoundErr = "no account found";

export const DonutContext = createContext();

export const DonutProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectMetamask = async () => {
    try {
      if (!ethereum) {
        throw new Error(MetamaskNotDetectedErr);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        throw new Error(NoAccountFoundErr);
      }
    } catch (error) {
      // display error dialog
      console.log(error);
    }
  };

  const addAccountChangeListener = () => {
    if (!currentAccount) {
      connectMetamask();
    }
    ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        // display error dialog
        console.log(NoAccountFoundErr);
      }
    });
  };

  useEffect(() => {
    try {
      if (!ethereum) {
        throw new Error(MetamaskNotDetectedErr);
      }
      addAccountChangeListener();
    } catch (error) {
      // display error dialog
      console.log(error);
    }
  }, []);

  return (
    <DonutContext.Provider value={{ currentAccount }}>
      {children}
    </DonutContext.Provider>
  );
};
