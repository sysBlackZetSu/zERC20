import { UAuthConnector } from "@uauth/web3-react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "web3-react-walletconnect-connector";
import { ALL_SUPPORTED_CHAIN_IDS } from "../constants/chains";
import { INFURA_NETWORK_URLS } from "../utils/infura";

// Instanciate your other connectors.
export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: INFURA_NETWORK_URLS,
  qrcode: true,
});

export const uauth = new UAuthConnector({
  clientID: process.env?.REACT_APP_CLIENT_ID,
  clientSecret: process.env?.REACT_APP_CLIENT_SECRET,
  redirectUri: process.env?.REACT_APP_REDIRECT_URI,
  // postLogoutRedirectUri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI!,
  fallbackIssuer: process.env?.REACT_APP_FALLBACK_ISSUER,

  // Scope must include openid and wallet
  scope: "openid wallet",

  // Injected and walletconnect connectors are required
  connectors: { injected, walletconnect },
});

const connectors = {
  injected,
  walletconnect,
  uauth,
};

export default connectors;
