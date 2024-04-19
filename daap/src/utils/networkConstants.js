import config from "./config";
import {
  arbitrumNodes,
  bscNodes,
  bscNodesTestnet,
  harmonyNodes,
  harmonyNodesTestnet,
  polygonNodes,
  polygonNodesTestnet,
} from "./rpcUrl";

export const bscNetworkDetail = {
  mainnet: {
    chainId: `0x${config.bscChain.toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "bnb",
      decimals: 18,
    },
    rpcUrls: bscNodes,
    blockExplorerUrls: [`https://bscscan.com/`],
  },
  testnet: {
    chainId: `0x${config.bscChainTestent.toString(16)}`,
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "bnb",
      decimals: 18,
    },
    rpcUrls: bscNodesTestnet,
    blockExplorerUrls: [`https://testnet.bscscan.com`],
  },
};

export const polygonNetworkDetail = {
  mainnet: {
    chainId: `0x${config.polygon_chain_mainnet.toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: polygonNodes,
    blockExplorerUrls: [`https://polygonscan.com/`],
  },
  testnet: {
    chainId: `0x${config.polygon_chain_testnet.toString(16)}`,
    chainName: "Polygon Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "matic",
      decimals: 18,
    },
    rpcUrls: polygonNodesTestnet,
    blockExplorerUrls: [`https://mumbai.polygonscan.com/`],
  },
};

export const harmonyNetworkDetail = {
  mainnet: {
    chainId: `0x${config.hmyChainMainnet.toString(16)}`,
    chainName: "Harmony Mainnet",
    nativeCurrency: {
      name: "ONE",
      symbol: "one",
      decimals: 18,
    },
    rpcUrls: harmonyNodes,
    blockExplorerUrls: [`https://explorer.harmony.one/`],
  },
  testnet: {
    chainId: `0x${config.hmyChainTestnet.toString(16)}`,
    chainName: "Harmony Testnet",
    nativeCurrency: {
      name: "ONE",
      symbol: "one",
      decimals: 18,
    },
    rpcUrls: harmonyNodesTestnet,
    blockExplorerUrls: [`https://explorer.pops.one/`],
  },
};

export const arbitrumNetworkDetail = {
  mainnet: {
    chainId: `0x${config.arbitrumChain.toString(16)}`,
    chainName: "Arbitrum one",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: arbitrumNodes,
    blockExplorerUrls: [`https://arbiscan.io/`],
  },
  testnet: {
    chainId: `0x${config.arbitrumGoerliChain.toString(16)}`,
    chainName: "Arbitrum goerli",
    nativeCurrency: {
      name: "AGOR",
      symbol: "aogr",
      decimals: 18,
    },
    rpcUrls: harmonyNodesTestnet,
    blockExplorerUrls: [`https://goerli-rollup-explorer.arbitrum.io/`],
  },
};

export const ethereumNetworkDetail = {
  mainnet: {
    chainId: `0x${config.chainId.toString(16)}`,
    chainName: "Ethereum Mainnet",
    chainRaw: config.chainId,
  },
  testnet: {
    chainId: `0x${config.chainIdTestnet.toString(16)}`,
    chainName: "Koven Testnet",
    chainRaw: config.chainId,
  },
};
