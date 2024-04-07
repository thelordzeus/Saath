import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import App from "./App";
import "./index.css";
import { StateContextProvider } from "./context";
const root = ReactDom.createRoot(document.getElementById("root"));
import { Sepolia } from "@thirdweb-dev/chains";

root.render(
  <ThirdwebProvider
    activeChain={Sepolia}
    ChainId={import.meta.env.VITE_CLIENT_ID}
  >
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
