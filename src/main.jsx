import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@rainbow-me/rainbowkit/styles.css'
import './styles/theme.css'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit'
import {
  phantomWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  injectedWallet
} from '@rainbow-me/rainbowkit/wallets'
import { mainnet, base, arbitrum, optimism, polygon } from 'wagmi/chains'
 
import App from './App.jsx'
import { TenantProvider } from './context/TenantContext.jsx'
 
 const appName = import.meta.env.VITE_APP_NAME || 'Gateway'
 const projectId = import.meta.env.VITE_WC_PROJECT_ID || ''
 const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
 if (isMobile && !projectId) {
   console.error('[WalletConnect] Missing VITE_WC_PROJECT_ID. Mobile wallets (Phantom, etc.) require a WalletConnect Project ID.')
 }
 
 const defaultChainId = Number(import.meta.env.VITE_DEFAULT_CHAIN_ID || 1)
 
 const allChains = [mainnet, base, arbitrum, optimism, polygon]
 const chains = allChains

 const connectors = connectorsForWallets(
   [
     {
       groupName: 'Recommended',
       wallets: [phantomWallet, metaMaskWallet, rainbowWallet, walletConnectWallet, injectedWallet]
     }
   ],
   { appName, projectId }
 )

 const config = createConfig({
   chains,
   connectors,
   transports: {
     [mainnet.id]: http(),
     [base.id]: http(),
     [arbitrum.id]: http(),
     [optimism.id]: http(),
     [polygon.id]: http()
   },
   ssr: false
 })
 
  const queryClient = new QueryClient()
  
 function getInitialChain() {
   const c = chains.find(x => x.id === defaultChainId)
   return c || chains[0]
 }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={getInitialChain()}
          theme={darkTheme({
            accentColor: 'rgba(0,255,170,0.9)',
            accentColorForeground: 'rgba(0,0,0,0.95)',
            borderRadius: 'large',
            overlayBlur: 'small'
          })}
          modalSize="compact"
        >
          <BrowserRouter>
            <TenantProvider>
              <App />
            </TenantProvider>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
