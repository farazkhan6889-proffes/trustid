import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
  type EIP1193Provider,
} from "viem";

export const hardhatLocal = defineChain({
  id: 31337,
  name: "Hardhat Local",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
});

export const publicClient = createPublicClient({
  chain: hardhatLocal,
  transport: http(),
});

export function getWalletClient() {
  if (typeof window === "undefined") {
    throw new Error("Wallet can only be used in the browser");
  }

  const ethereum = (window as Window & {
    ethereum?: EIP1193Provider;
  }).ethereum;

  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  return createWalletClient({
    chain: hardhatLocal,
    transport: custom(ethereum),
  });
}