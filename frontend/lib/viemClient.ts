// lib/viemClient.ts
"use client";

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare const window: EthereumWindow;

import { baseSepolia } from "viem/chains";
import { createWalletClient, createPublicClient, custom } from "viem";

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: custom(window.ethereum!),
});

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum!),
});
