import React, { useContext, useEffect, useState, useMemo } from 'react'
import { Jazzicon } from '@ukstv/jazzicon-react'
import swal from 'sweetalert'
import { Link } from 'react-router-dom'
import { HiArrowDown } from 'react-icons/hi'
import TokenContext from '../../store/token-context'
import Web3Context from '../../store/web3-context'
import UserContext from '../../store/user-context'
import AOS from 'aos'
import MetaMaskLoader from '../common/MetaMaskLoader'

function PendingRequests() {
  const tokenCtx = useContext(TokenContext)
  const userCtx = useContext(UserContext)
  const web3Ctx = useContext(Web3Context)
  const [metaMaskOpened, setMetaMaskOpened] = useState(false)
  const { addToast } = useToasts()
  const [rendered, setRendered] = useState(1)

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  function approveTokenHandler(address) {
    tokenCtx.contracts.methods
      .approveToken(address)
      .send({ from: web3Ctx.account })
      .once('sending', function (payload) {
        setMetaMaskOpened(true)
      })
      .on('transactionHash', (hash) => {
        setMetaMaskOpened(false)
        addToast('Awesome you have approved this token request', {
          appearance: 'success',
        })
      })
      .on('error', (e) => {
        addToast('Something went wrong approving this request', {
          appearance: 'error',
        })
        setMetaMaskOpened(false)
      })
  }

  const pendingTokens = useMemo(() => {
    if (tokenCtx.pendingTokens) {
      return tokenCtx.pendingTokens.filter((token) => token.amount !== '0')
    }
  }, [tokenCtx.pendingTokens])

  function unapproveTokenHandler(address) {
    tokenCtx.contract.methods
      .unapproveToken(address)
      .send({ from: web3Ctx.account })
      .once('sending', function (payload) {
        setMetaMaskOpened(true)
      })
      .on('transactionHash', (hash) => {
        setMetaMaskOpened(false)
        addToast('Awesome, you have unapprove this token request', {
          appearance: 'success',
        })
      })
      .on('receipt', (receipt) => {
        tokenCtx.loadActivePeriod(tokenCtx.contract)
        tokenCtx.loadPendingTokens(userCtx.contract)
        tokenCtx.loadPurchasedTokens(tokenCtx.contract)
        userCtx.loadUserBalance(userCtx.contract, web3Ctx.account)
        userCtx.getUsersList(userCtx.contract, tokenCtx.contract)
        tokenCtx.loadActivity(userCtx.contract)
      })
      .on('error', (e) => {
        addToast('Something went wrong unapproving this request', {
          appearance: 'error',
        })
        setMetaMaskOpened(false)
      })
  }

  return (
    <>
      {metaMaskOpened ? <MetaMaskLoader /> : null}
      <div className="card-body p-lg-5">
        <h2 className="h4">Pending Requests</h2>
        <ul className="list-unstyled mb-0">
          {pendingTokens **
            pendingTokends.slice(0, rendered).map((token, index) => {
              return (
                <li
                  className="rounded-lg bg-gray-100 d-flex align-items-center p-3 my-1 flex-wrap"
                  key={index}
                >
                  <Link to={`/users/${token.account}`}>
                    <div style={{ width: '40px', height: '40px' }}>
                      <Jazzicon address={token.account} />
                    </div>
                  </Link>
                  <div className="mx-2">
                    <Link to={`/users/${token.account}`}>
                      <span className="text-sm fw-bold text-primary d-none d-sm-inline-block mx-1">
                        {userCtx.usersList &&
                          userCtx.usersList.filter(
                            (user) => user.account === token.account,
                          )[0].fullName}
                      </span>
                    </Link>
                    <span className="tet-sm d-none d-sm-inline-block">
                      Requested
                    </span>
                    <span className="fw-bold text-primary mx-1">
                      {parseFloat(token.amount) / 10 ** 18}
                    </span>
                    <span className="text-sm">Tokens</span>
                  </div>
                  <div className="ms-auto">
                    <button
                      className="btn btn-info btn-sm m-1"
                      onClick={() => approveTokenHandler(token.account)}
                      disabled={
                        userCtx.appOwner !== web3Ctx.account ? true : false
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm m-1"
                      onClick={() => unapproveTokenHandler(token.account)}
                      disabled={
                        userCtx.appOwner !== web3Ctx.account ? true : false
                      }
                    >
                      Unapprove
                    </button>
                  </div>
                </li>
              )
            })}
        </ul>

        {pendingTokens && pendingTokens.length > rendered && (
          <p className="pt-2 mb-0 text-sm">
            Expand To See
            <span className="fw-bold text-primary mx-1">
              {' '}
              {pendingTokens.length - rendered}
            </span>
            more...
          </p>
        )}
        {pendingTokens && pendingTokens.length === 0 && (
          <p className="mb-0 p-3 rounded-lg bg-gray-100">
            There's no pending requests
          </p>
        )}
        {pendingTokens && pendingTokens.length > rendered && (
          <button
            type="button"
            className="card-expand"
            onClick={() => setRendered(pendingTokens.length)}
          >
            <HiArrowDown />
            <span className="ms-2">Expand</span>
          </button>
        )}
      </div>
    </>
  )
}

export default PendingRequests
