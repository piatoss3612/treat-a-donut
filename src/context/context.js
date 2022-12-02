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
  const [isLoading, setIsLoading] = useState(false);

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

  const loadCurrentAccount = useCallback(async (address) => {
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

  const register = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!ethereum) {
        throw new Error(MetamaskNotDetectedErr);
      }
      if (!currentAccount.address) {
        throw new Error(NoAccountFoundErr);
      }
      if (currentAccount.isUser === true) return;

      const smartContract = loadSmartContract();
      const transactionHash = await smartContract.register();

      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);

      console.log(transactionHash);
      // display success dialog
      loadCurrentAccount(currentAccount.address);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // display error dialog
      console.log(error);
    }
  }, [currentAccount.address, currentAccount.isUser, loadCurrentAccount]);

  const unregister = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!ethereum) {
        throw new Error(MetamaskNotDetectedErr);
      }
      if (!currentAccount.address) {
        throw new Error(NoAccountFoundErr);
      }
      if (currentAccount.isUser === false) return;
      const smartContract = loadSmartContract();
      const transactionHash = await smartContract.unregister();

      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);

      console.log(transactionHash);
      // display success dialog
      loadCurrentAccount(currentAccount.address);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // display error dialog
      console.log(error);
    }
  }, [currentAccount.address, currentAccount.isUser, loadCurrentAccount]);

  const connectMetamask = useCallback(async () => {
    try {
      if (!ethereum) {
        throw new Error(MetamaskNotDetectedErr);
      }
      setIsLoading(true);

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        loadCurrentAccount(accounts[0]);
      } else {
        throw new Error(NoAccountFoundErr);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // display error dialog
      console.log(error);
    }
  }, [loadCurrentAccount]);

  const addAccountChangeListener = useCallback(() => {
    if (!currentAccount.address) {
      connectMetamask();
    }
    ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length) {
        loadCurrentAccount(accounts[0]);
      } else {
        // display error dialog
        console.log(NoAccountFoundErr);
      }
    });
  }, [connectMetamask, currentAccount.address, loadCurrentAccount]);

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
    <DonutContext.Provider
      value={{
        connectMetamask,
        currentAccount,
        register,
        unregister,
        isLoading,
      }}
    >
      {children}
    </DonutContext.Provider>
  );
};
