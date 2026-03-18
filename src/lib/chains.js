import { mainnet, base, arbitrum, optimism, polygon } from 'wagmi/chains'

export const CHAINS = [mainnet, base, arbitrum, optimism, polygon]

export function chainName(chainId) {
  const c = CHAINS.find(x => x.id === Number(chainId))
  return c?.name || `Chain ${chainId}`
}
