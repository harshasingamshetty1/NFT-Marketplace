import { createContext, useContext, useState, useEffect } from "react";

const Web3Context = createContext();

export const useWeb3 = () => {
  return useContext(Web3Context);
};

export function Web3Provider({ children }) {
  const [connected, setConnected] = useState(false);
  const [currAddress, updateAddress] = useState("0x");

  useEffect(() => {
    // Check for MetaMask connection and update connected state accordingly.
    // You can include your MetaMask connection logic here.
  }, []);

  const value = {
    connected,
    setConnected, // A function to update the connected state.
    currAddress,
    updateAddress,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}
