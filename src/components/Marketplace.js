import React, { useState, useEffect } from "react";
import axios from "axios";
import MarketplaceJSON from "../abi/Marketplace.json";
import { GetIpfsUrlFromPinata } from "../utils/utils";
import Navbar from "./Navbar";
import NFTTile from "./NFTTile";

export default function Marketplace() {
  const [data, updateData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getAllNFTs() {
    try {
      const ethers = require("ethers");
      // After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );

      // Create an NFT Token
      let transaction = await contract.getAllNFTs();

      // Fetch all the details of every NFT from the contract and display
      const items = await Promise.all(
        transaction.map(async (i) => {
          var tokenURI = await contract.tokenURI(i.tokenId);
          tokenURI = GetIpfsUrlFromPinata(tokenURI);
          let meta = await axios.get(tokenURI);
          meta = meta.data;

          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };
          return item;
        })
      );

      updateData(items);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false in case of error
      // Handle errors here if necessary
    }
  }

  useEffect(() => {
    getAllNFTs();
  }, []);

  return (
    <div className="w-full h-full ">
      <div className="bg-black w-screen ">
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
          <div className="md:text-xl font-bold text-white">Listed NFTs</div>
          <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
            {loading ? (
              // Render loading spinners here
              <div className="spinner  text-white">Loading...</div>
            ) : (
              // Render fetched data here
              data.map((value, index) => {
                return <NFTTile data={value} key={index}></NFTTile>;
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
