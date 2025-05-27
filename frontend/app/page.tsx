"use client";

// Add ethereum to the Window type
declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useState, useEffect } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
} from "viem";
import { baseSepolia } from "viem/chains";
import { ethers } from "ethers";

export default function HomePage() {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [txs, setTxs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        setError("MetaMask not found");
        return;
      }

      const walletClient = createWalletClient({
        chain: baseSepolia,
        transport: custom(window.ethereum),
      });

      const [account] = await walletClient.requestAddresses();
      setAddress(account);
    } catch (err) {
      console.error(err);
      setError("Failed to connect wallet");
    }
  };

  const fetchBalance = async () => {
    if (!address || typeof window === "undefined" || !window.ethereum) return;
    try {
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: custom(window.ethereum),
      });

      const balance = await publicClient.getBalance({ address });
      setBalance(formatEther(balance));
    } catch (err) {
      setError("Failed to fetch balance");
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc`
      );
      const data = await res.json();
      if (data.status !== "1") throw new Error(data.message);

      const txList = data.result.map(
        (tx: any) =>
          `Hash: ${tx.hash}\nFrom: ${tx.from}\nTo: ${
            tx.to
          }\nValue: ${ethers.formatEther(tx.value)} ETH`
      );

      setTxs(txList);
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchBalance();
      fetchTransactions();
    }
  }, [address]);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-4">Base Testnet Wallet Viewer</h1>
      <button
        onClick={connectWallet}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
      >
        Connect Wallet
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {address && (
        <div className="mt-6 space-y-4">
          <div>
            <h2 className="font-semibold">Address:</h2>
            <p className="break-all">{address}</p>
          </div>
          <div>
            <h2 className="font-semibold">Balance:</h2>
            <p>{balance} ETH</p>
          </div>
          <div>
            <h2 className="font-semibold">Last 10 Transactions:</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <pre className="bg-gray-800 p-4 rounded text-sm whitespace-pre-wrap">
                {txs.length > 0
                  ? txs.join("\n\n---\n\n")
                  : "No transactions found"}
              </pre>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
