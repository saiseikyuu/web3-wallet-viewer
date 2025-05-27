"use client";

import { useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setError(null);

    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      setAddress(userAddress);

      // ✅ Fetch ETH balance
      const bal = await provider.getBalance(userAddress);
      const formatted = ethers.formatEther(bal);
      setBalance(formatted);

      // ✅ Fetch transactions
      await fetchTransactions(userAddress);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Wallet connection failed");
    }
  };

  const fetchTransactions = async (userAddress: string) => {
    try {
      const apiKey = "YOUR_ETHERSCAN_API_KEY"; // Replace with your Etherscan API key
      const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "1") throw new Error("Failed to fetch transactions");

      const txList = data.result.map(
        (tx: any) =>
          `Hash: ${tx.hash}\nFrom: ${tx.from}\nTo: ${
            tx.to
          }\nValue: ${ethers.formatEther(tx.value)} ETH`
      );

      setTransactions(txList);
    } catch (err) {
      console.error(err);
      setTransactions(["❌ Error fetching transactions"]);
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
          <p className="text-green-400">
            ✅ Connected: <span className="break-all">{address}</span>
          </p>

          <p className="text-yellow-300">
            💰 Balance: <strong>{balance} ETH</strong>
          </p>

          {transactions.length > 0 && (
            <div>
              <p className="text-white font-semibold">
                📜 Last 10 Transactions:
              </p>
              <pre className="bg-gray-900 p-4 rounded text-sm whitespace-pre-wrap overflow-x-auto">
                {transactions.join("\n\n---\n\n")}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
