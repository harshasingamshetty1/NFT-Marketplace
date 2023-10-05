import fullLogo from "../assets/image.png";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");
    if (connected) {
      console.log(
        "🚀 ~ file: Navbar.js:29 ~ updateButton ~ connected:",
        connected
      );
      ethereumButton.textContent = "Disconnect"; // Change button text to "Disconnect"
      ethereumButton.classList.remove("hover:bg-blue-70");
      ethereumButton.classList.remove("bg-blue-500");
      ethereumButton.classList.add("hover:bg-red-70"); // Add a class for the disconnect button
      ethereumButton.classList.add("bg-red-500");
    } else {
      console.log("🚀 ~ file: Navbar.js:36 ~ updateButton ~ else:");

      ethereumButton.textContent = "Connect Wallet"; // Change back to "Connect Wallet"
      ethereumButton.classList.remove("hover:bg-red-70"); // Remove the disconnect button class
      ethereumButton.classList.remove("bg-red-500");
      ethereumButton.classList.add("hover:bg-blue-70");
      ethereumButton.classList.add("bg-blue-500");
    }
  }

  async function connectWebsite() {
    // If already connected, disconnect
    if (connected) {
      console.log(
        "🚀 ~ file: Navbar.js:46 ~ connectWebsite ~ connected:",
        connected
      );
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      toggleConnect(false); // Update connected state to false
      updateAddress("0x"); // Reset address
      updateButton(); // Update button UI

      return;
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x13881") {
      console.log(
        "🚀 ~ file: Navbar.js:63 ~ connectWebsite ~ chainId:",
        chainId
      );
      //alert('Incorrect network! Switch your metamask network to Mumbai');
      console.log("🚀 ~ file: Navbar.js:82 ~ connectWebsite ~ window:", window);

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
    }
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        toggleConnect(true); // Update connected state to true
        updateButton(); // Update button UI
        console.log("here");
        getAddress();
        window.location.replace(location.pathname);
      });
    console.log("🚀 ~ file: Navbar.js:79 ~ connectWebsite ~ window:");
  }

  useEffect(() => {
    if (window.ethereum == undefined) return;
    let val = window.ethereum.isConnected();
    if (val) {
      console.log("here");
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname);
    });
  });

  return (
    <div className="">
      <nav className="w-screen">
        <ul className="flex items-end justify-between py-3 bg-transparent text-white pr-5">
          <li className="flex items-end ml-5 pb-2">
            <Link to="/">
              <img
                src={fullLogo}
                alt=""
                width={120}
                height={120}
                className="inline-block -mt-2"
              />
              <div className="inline-block font-bold text-xl ml-2">
                NFT Marketplace
              </div>
            </Link>
          </li>
          <li className="w-2/6">
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
        {currAddress !== "0x" ? currAddress.substring(0, 15) + "..." : ""}
      </div>
    </div>
  );
}

export default Navbar;
