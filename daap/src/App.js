import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { Fragment } from "react";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./store";

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import {
    createWeb3Modal,
    useWeb3ModalTheme
} from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi'
import {
    bsc,
    mainnet,
    polygon,
    arbitrum,
    bscTestnet,
    goerli,
    polygonMumbai,
    arbitrumGoerli
} from 'wagmi/chains';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "0x617f3112bf5397D0467D315cC709EF968D9ba546";
if (!projectId) {
    throw new Error('REACT_APP_WALLET_CONNECT_PROJECT_ID is not set')
}

const wagmiConfig = defaultWagmiConfig({
    chains: [
        mainnet,
        goerli,
        arbitrum,
        arbitrumGoerli,
        bsc,
        bscTestnet,
        polygon,
        polygonMumbai
    ],
    projectId,
    metadata: {
        name: 'Web3Modal React Example',
        description: 'Web3Modal React Example',
        url: '',
        icons: []
    }
});

createWeb3Modal({
    wagmiConfig,
    projectId,
    themeMode: 'light',
    themeVariables: {
        "--w3m-background-color": "#000000",
        "--w3m-z-index": 12,
        "--w3m-accent-fill-color": "#ffffff",
        "--w3m-text-big-bold-size": 18,
        "--w3m-accent-color": "#121827",
    }
})

function App() {
    const { setThemeMode } = useWeb3ModalTheme();
    setThemeMode('dark');

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <WagmiProvider config={wagmiConfig}>
                    <QueryClientProvider client={queryClient}>
                        <Fragment>
                            <Home />
                        </Fragment>
                    </QueryClientProvider>
                </WagmiProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
