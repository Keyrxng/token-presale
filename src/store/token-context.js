import React from 'react'

const TokenContext = React.createContext({
  contract: null,
  totalSupply: null,
  activePeriod: null,
  periods: null,
  appOwner: null,
  activity: null,
  tokenPrice: null,
  minimumTokens: null,
  hardcap: null,
  pendingTokens: null,
  purchasedtokens: null,
  tokenIsLoading: null,
  loadContract: () => {},
  loadTotalSupply: () => {},
  loadAppOwner: () => {},
  loadActivePeriod: () => {},
  loadPeriods: () => {},
  loadTokenPrice: () => {},
  loadMinimumTokens: () => {},
  loadHardcap: () => {},
  loadPendingTokens: () => {},
  loadPurchasedTokens: () => {},
  setTokenIsLoading: () => {},
})

export default TokenContext
