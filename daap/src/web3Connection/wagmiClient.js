import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { createConfig } from "wagmi"; // Import createConfig function from wagmi
import {
  bsc,
  mainnet,
  polygon,
  arbitrum,
  bscTestnet,
  goerli,
  polygonMumbai,
  arbitrumGoerli,
} from "wagmi/chains";

const chains = [
  mainnet,
  goerli,
  arbitrum,
  arbitrumGoerli,
  bsc,
  bscTestnet,
  polygon,
  polygonMumbai,
];

export const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [mainnet, goerli],
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(),
  },
})

