"use client";

import { useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletViewer() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ETHERSCAN_API_KEY = "1Y74IND9CC6CXZB6B3ZAQD155DEI2RXWR3";

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const bal = await provider.getBalance(userAddress);

      setAddress(userAddress);
      setBalance(ethers.formatEther(bal));
      fetchTransactions(userAddress);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Connection failed");
    }
  };

  const fetchTransactions = async (userAddress: string) => {
    try {
      const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "1") throw new Error("No transactions found");

      const txList = data.result.map(
        (tx: any) =>
          `Hash: ${tx.hash}\nFrom: ${tx.from}\nTo: ${
            tx.to || "Contract Creation"
          }\nValue: ${ethers.formatEther(tx.value)} ETH`
      );

      setTransactions(txList);
    } catch (err) {
      console.error(err);
      setTransactions(["❌ Failed to fetch transactions"]);
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
      >
        Connect Wallet
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {address && (
        <div className="mt-4 space-y-4">
          <p className="text-green-400 break-all">✅ Address: {address}</p>
          <p className="text-yellow-300">💰 Balance: {balance} ETH</p>

          <div>
            <p className="text-white font-semibold">📜 Last 10 Transactions:</p>
            <pre className="bg-gray-900 p-4 rounded text-sm whitespace-pre-wrap overflow-x-auto">
              {transactions.length > 0
                ? transactions.join("\n\n---\n\n")
                : "No transactions found"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
