import fullLogo from "../assets/CryptoCanvas.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router";
import { useWeb3 } from "../web3Context";

function Navbar() {
  const { connected, setConnected, currAddress, updateAddress } = useWeb3(); // Use the hook

  const location = useLocation();

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    console.log("🚀 ~ file: Navbar.js:16 ~ getAddress ~ addr:", addr);
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");

    ethereumButton.textContent = "Wallet connected"; // Change button text to "Disconnect"
    // ethereumButton.classList.remove("hover:bg-blue-70");
    // ethereumButton.classList.remove("bg-blue-500");
    // ethereumButton.classList.add("hover:bg-red-70"); // Add a class for the disconnect button
    // ethereumButton.classList.add("bg-red-500");
  }

  async function connectWebsite() {
    // If already connected, disconnect

    if (!window.ethereum) {
      alert("Please install metamask extension to continue.");
      return;
    }
    try {
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      console.log("connected1:", connected);

      if (chainId !== "0x13881") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      }
      console.log("connected2:", connected);

      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(() => {
          setConnected(true); // Update connected state to true
          // updateButton(); // Update button UI
          console.log("here");
          getAddress();
          // window.location.replace(location.pathname);
        });
    } catch (e) {
      console.log(e);
    }
  }

  // useEffect(() => {
  //   if (window.ethereum == undefined) return;
  //   let val = window.ethereum.isConnected();
  //   if (val) {
  //     console.log("here");
  //     getAddress();
  //     setConnected(val);
  //     updateButton();
  //   }

  //   window.ethereum.on("accountsChanged", function (accounts) {
  //     window.location.replace(location.pathname);
  //   });
  // });

  return (
    <div className="">
      <nav className="w-screen">
        <ul className="flex items-end justify-between py-3 bg-transparent text-white pr-5">
          <li className="flex items-end ml-5 pb-2">
            <Link to="/">
              <img
                src={fullLogo}
                alt=""
                width={240}
                height={240}
                className="inline-block -mt-2"
              />
              <div className="inline-block font-bold text-2xl ml-2">
                CryptoCanvas
              </div>
            </Link>
          </li>
          <li className="w-2/6 ">
            <ul className="lg:flex justify-between font-bold mr-10 text-lg">
              {location.pathname === "/" ? (
                <li className="border-b-2 hover:pb-0 p-2">
                  <Link to="/">Marketplace</Link>
                </li>
              ) : (
                <li className="hover:border-b-2 hover:pb-0 p-2">
                  <Link to="/">Marketplace</Link>
                </li>
              )}
              {location.pathname === "/sellNFT" ? (
                <li className="border-b-2 hover:pb-0 p-2">
                  <Link to="/sellNFT">List My NFT</Link>
                </li>
              ) : (
                <li className="hover:border-b-2 hover:pb-0 p-2">
                  <Link to="/sellNFT">List My NFT</Link>
                </li>
              )}
              {location.pathname === "/profile" ? (
                <li className="border-b-2 hover:pb-0 p-2">
                  <Link to="/profile">Profile</Link>
                </li>
              ) : (
                <li className="hover:border-b-2 hover:pb-0 p-2">
                  <Link to="/profile">Profile</Link>
                </li>
              )}
              <li>
                <button
                  className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={connectWebsite}
                >
                  {connected ? "Connected" : "Connect Wallet"}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className="text-white text-bold text-right mr-10 text-sm">
        {currAddress !== "0x"
          ? "Connected to"
          : "Not Connected. Please login to view NFTs"}{" "}
        {currAddress !== "0x"
          ? currAddress.substring(0, 7) +
            "..." +
            currAddress.substring(currAddress.length - 4)
          : ""}
      </div>
    </div>
  );
}

export default Navbar;
