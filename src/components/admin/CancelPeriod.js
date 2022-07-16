import React, { useEffect, useContext, useState } from 'react'
import swal from 'sweetalert'
import { ImClost2 } from 'react-icons/im'
import { FaEthereum } from 'react-icons/fa'
import { AiFillInfoCircle } from 'react-icons/ai'
import { formatDate, toEther } from '../../lib/utils'
import TokenContext from '../../store/token-context'
import UserContext from '../../store/user-context'
import Web3Context from '../../store/web3-context'
import AOS from 'aos'

import MetaMaskLoader from '../common/MetaMaskLoader'
import { act } from 'react-dom/test-utils'

function CancelPeriod() {
  const tokenCtx = useContext(TokenContext)
  const web3Ctx = useContext(Web3Context)
  const userCtx = useContext(UserContext)
  const [activePeriod, setActivePeriod] = useState(null)
  const [metaMaskOpened, setMetaMaskOpened] = useState(false)
  const { addToast } = useToasts()

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  function deactivatePeriodHandler() {
    tokenCtx.contract.methods
      .deactivatePeriod()
      .send({ from: web3Ctx.account })
      .once('sending', () => {
        setMetaMaskOpened(true)
      })
      .on('transactionHash', (hash) => {
        setMetaMaskOpened(false)
        addToast('Awesome, you have successfully minted your tokens', {
          appreance: 'success',
        })
      })
      .on('receipt', (receipt) => {
        tokenCtx.loadTotalSupply(tokenCtx.contract)
        tokenCtx.loadActivePeriod(tokenCtx.contract)
        tokenCtx.loadPeriods(tokenCtx.contract)
        tokenCtx.loadActivity(userCtx.contract)
        tokenCtx.loadMinimumTokens(tokenctx.contract)
        tokenCtx.loadTokenPrice(tokenCtx.contract)
      })
      .on('error', (e) => {
        addToast('Something went wrong with the mint', {
          appreance: 'error',
        })
        setMetaMaskOpened(false)
      })
  }

  useEffect(() => {
    if (tokenCtx.activePeriod) {
      setActivePeriod(tokenCtx.activePeriod)
    }
  }, [tokenCtx.activePeriod])

  return (
    <>
      {metaMaskOpened ? <MetaMaskLoader /> : null}
      <div className="card shadow-lg" data-aos="fade-up" data-aos-delay="300">
        <div className="card-body p-lg-5">
          <h2 className="h4">Deactivate Active Period</h2>

          {activePeriod && activePeriod.status ? (
            <>
              <ul className="list-unstyled mb-3">
                <li className="rounded-lb bg-gray-100 d-flex align-items-center py-2 px-3 my-2 flex-wrap fw-bold text-primary text-sm">
                  <ImClock2 />
                  <span className="fw-normal mx-2 text-gray-700">Ends at</span>
                  {formatDate(parseFloat(activePeriod.endTime))}
                </li>
                <li className="rounded-lg bg-gray-100 d-flex align-items-center py-2 px-3 my-2 flex-wrap fw-bold text-primary text-sm">
                  <FaEthereum size="1.2rem" />
                  <span className="fw-normal mx-2 text-gray-700">
                    Remaining tokens
                  </span>
                  {toEther(activePeriod.remainingTokens)}
                </li>
              </ul>
              <button
                className="btn btn-danger w-100"
                type="button"
                disabled={Boolean(userCtx.appOwner !== web3Ctx.account)}
                onClick={deactivatePeriodHandler}
              >
                Cancel Period
              </button>
            </>
          ) : (
            <p className="mb-0 p-3 rounded-lg bg-gray-100">
              There's no active periods
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default CancelPeriod
