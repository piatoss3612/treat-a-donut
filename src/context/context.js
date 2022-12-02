import { ethers } from "ethers";
import { createContext, useCallback, useEffect, useState } from "react";
import { ContractAddress, ContractAbi } from "../config/contract";

const { ethereum } = window;

const initialUserInfo = {
  address: "",
  isUser: false,
  box: {
    state: "",
    balance: "",
  },
};

const MetamaskNotDetectedErr = "metamask not detected";
const NoAccountFoundErr = "no account found";
const UserCheckErr = "unable to check whether registered user or not";
const DonutBoxLoadErr = "unable to load donut box";

export const DonutContext = createContext();

export const DonutProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(initialUserInfo);

  const loadSmartContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const smartContract = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      signer
    );

    return smartContract;
  };

  const loadUserInfo = useCallback(async (address) => {
    try {
      if (!ethereum) {
        throw new Error(MetamaskNotDetectedErr);
      }
      const smartContract = loadSmartContract();
      const isUser = await smartContract.isUser(address);
      if (isUser === true) {
        const box = await smartContract.boxOf(address);
        if (!box) {
          throw new Error(DonutBoxLoadErr);
        }
        setCurrentAccount({
          address: address,
          isUser: isUser,
          box: box,
        });
      } else if (isUser === false) {
        setCurrentAccount({ ...initialUserInfo, address: address });
      } else {
        throw new Error(UserCheckErr);
      }
    } catch (error) {
      // display error dialog
      console.log(error);
    }
  }, []);

  const connectMetamask = useCallback(async () => {
    try {
      if (!ethereum) {
        throw new Error(MetamaskNotDetectedErr);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        loadUserInfo(accounts[0]);
      } else {
        throw new Error(NoAccountFoundErr);
      }
    } catch (error) {
      // display error dialog
      console.log(error);
    }
  }, [loadUserInfo]);

  const addAccountChangeListener = useCallback(() => {
    if (!currentAccount.address) {
      connectMetamask();
    }
    ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length) {
        loadUserInfo(accounts[0]);
      } else {
        // display error dialog
        console.log(NoAccountFoundErr);
      }
    });
  }, [connectMetamask, currentAccount.address, loadUserInfo]);

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
  }, [addAccountChangeListener]);

  return (
    <DonutContext.Provider value={{ currentAccount }}>
      {children}
    </DonutContext.Provider>
  );
};
