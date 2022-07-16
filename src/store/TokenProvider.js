import React, { useReducer } from 'react'

import TokenContext from './token-context'

const defaultTokenState = {
  contract: null,
  appOwner: null,
  totalSupply: null,
  activity: null,
  activePeriod: null,
  periods: null,
  tokenPrice: null,
  minimumTokens: null,
  hardcap: null,
  purchasedTokens: null,
  pendingTokens: null,
  tokenIsLoading: null,
}

const TokenReducer = (state, action) => {
  if (action.type === 'CONTRACT') {
    return {
      ...state,
      contract: action.contract,
    }
  }

  if (action.type === 'LOADTOTALSUPPLY') {
    return {
      ...state,
      totalSupply: action.totalSupply,
    }
  }

  if (action.type === 'GETACTIVEPERIOD') {
    return {
      ...state,
      activePeriod: {
        ...state.activePeriod,
        startTime: action.activePeriod[0],
        endTime: action.activePeriod[1],
        tokenPrice: action.activePeriod[2],
        tokenAmount: action.activePeriod[3],
        remainingTokens: action.activePeriod[4],
        hardcap: action.activePeriod[5],
        status: action.activePeriod[6],
      },
    }
  }

  if (action.type === 'GETPERIODS') {
    return {
      ...state,
      periods: action.periods.map((period) => {
        return {
          startTime: period[0],
          endTime: period[1],
          tokenPrice: period[2],
          tokenAmount: period[3],
          remainingTokens: period[4],
          hardcap: period[5],
          status: period[6],
        }
      }),
    }
  }

  if (action.type === 'GETOWNER') {
    return {
      ...state,
      appOwner: action.appOwner,
    }
  }

  if (action.type === 'GETACTIVITY') {
    return {
      ...state,
      activity: action.activity,
    }
  }

  if (action.type === 'GETTOKENPRICE') {
    return {
      ...state,
      hardcap: action.hardcap,
    }
  }

  if (action.type === 'GETHARDCAP') {
    return {
      ...state,
      minimumTokens: parseFloat(action.minimumTokens),
    }
  }

  if (action.type === 'GETMINIMUMTOKENS') {
    return {
      ...state,
      minimumTokens: parseFloat(action.minimumTokens),
    }
  }

  if (action.type === 'GETPURCHASEDTOKENS') {
    return {
      ...state,
      purchasedTokens: action.purchasedTokens.map((token) => {
        return {
          account: token[0],
          amount: token[1],
        }
      }),
    }
  }

  if (action.type === 'GETPENDINGTOKENS') {
    return {
      ...state,
      pendingTokens: action.pendingTokens.map((token) => {
        return {
          account: token[0],
          amount: token[1],
        }
      }),
    }
  }

  if (action.type === 'LOADING') {
    return {
      ...state,
      tokenIsLoading: action.loading,
    }
  }

  return defaultTokenState
}

const TokenProvider = (props) => {
  const [TokenState, dispatchTokenAction] = useReducer(
    TokenReducer,
    defaultTokenState,
  )

  const loadContractHandler = (web3, presaleToken, deployedNetwork) => {
    const contract = deployedNetwork
      ? new web3.eth.Contract(presaleToken.abi, deployedNetwork.address)
      : ''
    dispatchTokenAction({ type: 'CONTRACT', contract: contract })
    return contract
  }

  const loadActivePeriodHandler = async (contract) => {
    try {
      const activePeriod = await contract.methods.getActivePeriod().call()
      dispatchTokenAction({
        type: 'GETACTIVEPERIOD',
        activePeriod: activePeriod,
      })
      return activePeriod
    } catch (error) {
      console.log('loadActivePeriodHandler Error: ', error)
    }
  }

  const loadPeriodsHandler = async (contract) => {
    try {
      const periods = await contract.methods.getPeriods().call()
      dispatchTokenAction({ type: 'GETPERIODS', periods: periods })
      return periods
    } catch (error) {
      console.log('loadPeriodsHandler Error: ', error)
    }
  }

  const loadTotalSupplyHandler = async (contract) => {
    try {
      const totalSupply = await contract.methods.totalSupply().call()
      dispatchTokenAction({ type: 'LOADTOTALSUPPLY', totalSupply: totalSupply })
      return totalSupply
    } catch (error) {
      console.log('loadTotalSupplyHandler Error: ', error)
    }
  }

  const loadAppOwnerHandler = async (contract) => {
    try {
      const appOwner = await contract.methods.owner().call()
      dispatchTokenAction({ type: 'GETOWNER', appOwner: appOwner })
      return appOwner
    } catch (error) {
      console.log('loadAppOwnerHandler Error: ', error)
    }
  }

  const loadActivityHandler = async (contract) => {
    try {
      const activity = await contract.methods.getActivities().call()
      dispatchTokenAction({ type: 'GETACTIVITY', activity: activity })
      return activity
    } catch (error) {
      console.log('loadActivityHandler Error: ', error)
    }
  }

  const loadPurchasedTokensHandler = async (contract, account) => {
    try {
      const purchasedTokens = await contract.methods
        .getPurchasedTokens(account)
        .call()
      dispatchTokenAction({
        type: 'GETPURCHASEDTOKENS',
        purchasedTokens: purchasedTokens,
      })
      return purchasedTokens
    } catch (error) {
      console.log('loadPurchasedTokensHandler Error: ', error)
    }
  }

  const loadTokenPriceHandler = async (contract) => {
    try {
      const tokenPrice = await contract.methods.price.call()
      dispatchTokenAction({ type: 'GETTOKENPRICE', tokenPrice: tokenPrice })
      return tokenPrice
    } catch (error) {
      console.log('loadTokenPriceHandler Error: ', error)
    }
  }

  const loadTokenHardcapHandler = async (contract) => {
    try {
      const hardcap = await contract.methods.hardcap().call()
      dispatchTokenAction({ type: 'GETHARDCAP', hardcap: hardcap })
      return hardcap
    } catch (error) {
      console.log('loadTokenHardcapHandler Error: ', error)
    }
  }

  const loadMinimumTokensHandler = async (contract) => {
    try {
      const minimumTokens = await contract.methods.getMinimumTokens().call()
      dispatchTokenAction({
        type: 'GETMINIMUMTOKENS',
        minimumTokens: minimumTokens,
      })
      return minimumTokens
    } catch (error) {
      console.log('loadMinimumTokensHandler Error: ', error)
    }
  }

  const loadPendingTokensHandler = async (contract) => {
    try {
      const pendingTokens = await contract.methods.getPendingTokens().call()
      dispatchTokenAction({
        type: 'GETPENDINGTOKENS',
        pendingTokens: pendingTokens,
      })
      return pendingTokens
    } catch (error) {
      console.log('loadPendingTokensHandler Error: ', error)
    }
  }

  const setTokenIsLoadingHandler = (loading) => {
    dispatchTokenAction({ type: 'LOADING', loading: loading })
  }

  const tokenContext = {
    contract: TokenState.contract,
    totalSupply: TokenState.totalSupply,
    tokenIsLoading: TokenState.tokenIsLoading,
    activePeriod: TokenState.activePeriod,
    periods: TokenState.periods,
    appOwner: TokenState.appOwner,
    activity: TokenState.activity,
    tokenPrice: TokenState.tokenPrice,
    minimumTokens: TokenState.minimumTokens,
    hardcap: TokenState.hardcap,
    purchasedTokens: TokenState.purchasedTokens,
    pendingtokens: TokenState.pendingTokens,
    loadContract: loadContractHandler,
    loadTotalSupply: loadTotalSupplyHandler,
    loadAppOwner: loadAppOwnerHandler,
    loadActivity: loadActivityHandler,
    loadTokenPrice: loadTokenPriceHandler,
    loadMinimumTokens: loadMinimumTokensHandler,
    loadTokenHardcap: loadTokenHardcapHandler,
    loadActivePeriod: loadActivePeriodHandler,
    loadPeriods: loadPeriodsHandler,
    loadPurchasedTokens: loadPurchasedTokensHandler,
    loadPendingTokens: loadPendingTokensHandler,
    setTokenIsLoading: setTokenIsLoadingHandler,
  }

  return (
    <TokenContext.Provider value={tokenContext}>
      {props.children}
    </TokenContext.Provider>
  )
}

export default TokenProvider
