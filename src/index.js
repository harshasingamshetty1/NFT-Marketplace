import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SellNFT from "./components/SellNFT";
import Marketplace from "./components/Marketplace";
import Profile from "./components/Profile";
import NFTPage from "./components/NFTpage";
import { Web3Provider } from "./web3Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Web3Provider>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/sellNFT" element={<SellNFT />} />
          <Route path="/nftPage/:tokenId" element={<NFTPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </Web3Provider>
);
