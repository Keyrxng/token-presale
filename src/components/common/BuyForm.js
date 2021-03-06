import React, { useEffect, useContext, useState } from 'react'
import Countdown from 'react-countdown'
import Web3Context from '../../store/web3-context'
import TokenContext from '../../store/token-context'
import UserContext from '../../store/user-context'
import { useForm } from 'react-hook-form'
import { usePopperTooltip } from 'react-popper-tooltip'
import { TiCancel } from 'react-icons/ti'
import { precision, toEther } from '../../lib/utils'
import { BsCalendar2CheckFill } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import AOS from 'aos'
import swal from 'sweetalert'

import MetaMaskLoader from '../common/MetaMaskLoader'

function BuyForm() {
  const tokenCtx = useContext(TokenContext)
  const web3Ctx = useContext(Web3Context)
  const userCtx = useContext(UserContext)
  const [metaMaskOpened, setMetaMaskOpened] = useState(false)
  const navigate = useNavigate()
  const [price, setPrice] = useState(0)
  const [minimumTokens, setMinumumTokens] = useState(0)
  const [round, setRound] = useState()
  const [tokenHardcap, setTokenHardcap] = useState()
  const [etherHardcap, setEtherHardcap] = useState()

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
  } = usePopperTooltip({
    placement: 'left',
  })

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  useEffect(() => {
    if (tokenCtx.contract) {
      setPrice(parseInt(tokenCtx.tokenPrice))
      setTokenHardcap(parseInt(tokenCtx.hardcap))
      console.log('hardcap: ', tokenHardcap)
    }
  }, [tokenCtx.tokenPrice, tokenCtx.hardcap])

  const hardcap1 = toEther(0.5)
  const userCap1 = 8000000000000 / (480 / 0.5)
  const hardcap2 = toEther(1)
  const userCap2 = 8000000000000 / (800 / 1)
  const hardcap3 = toEther(3)
  const userCap3 = 8000000000000 / (1600 / 3)
  const hardcap4 = toEther(6)
  const userCap4 = 8000000000000 / (2400 / 6)
  const hardcap5 = toEther(15)
  const userCap5 = 8000000000000 / (12000 / 15)

  useEffect(() => {
    setMinumumTokens(tokenCtx.minimumTokens / 10 ** 18)
    setRound(tokenCtx.activePeriod)

    var list = tokenCtx.activePeriod

    if (round === 0) {
      setTokenHardcap(userCap1)
      setEtherHardcap(hardcap1)
    } else if (round === 1) {
      setTokenHardcap(userCap2)
      setEtherHardcap(hardcap2)
    } else if (round === 2) {
      setTokenHardcap(userCap3)
      setEtherHardcap(hardcap3)
    } else if (round === 3) {
      setTokenHardcap(userCap4)
      setEtherHardcap(hardcap4)
    } else if (round === 4) {
      setTokenHardcap(userCap5)
      setEtherHardcap(hardcap5)
    }
    console.log(tokenHardcap)
    console.log(round)
  }, [tokenCtx.minimumTokens, tokenCtx.activePeriod, round])

  const {
    register,
    handleSumbit,
    formState: { errors },
  } = useForm()

  function onSubmit(data) {
    if (price)
      if (price > 0) {
        const amount = parseFloat(data.requestedTokenAmount)
        const sentAmount = amount * 10 ** precision(amount)
        tokenCtx.contract.methods
          .requestToken(sentAmount, precision(amount))
          .send({ from: web3Ctx.account, value: parseInt(amount * price) })
          .once('sending', function (payload) {
            setMetaMaskOpened(true)
          })
          .on('transactionHash', (hash) => {
            setMetaMaskOpened(false)
            addToast(
              `Awesome, you have purchased ${data.requestedTokenAmount} tokens`,
              {
                appearance: 'success',
              },
            )
          })
          .on('receipt', (receipt) => {
            tokenCtx.loadActivePeriod(tokenCtx.contract)
            tokenCtx.loadActivity(userCtx.contract)
            tokenCtx.loadPurchasedTokens(userCtx.contract)
            tokenCtx.loadPendingTokens(tokenCtx.contract)
            setTimeout(() => navigate('my-info'), 1000)
          })
          .on('error', (e) => {
            addToast('Something went wrong writing data on-chain', {
              appearance: 'error',
            })
            setMetaMaskOpened(false)
          })
        console.log(
          'tx details: ',
          'amount: ',
          amount,
          'sentAmount: ',
          sentAmount,
          'precsion(amount): ',
          precision(amount),
          'amount*price: ',
          amount * price,
          'price: ',
          price,
        )
      }
  }

  function deactivatePeriodHandler() {
    tokenCtx.contract.methods
      .deactivatePeriod()
      .send({ from: web3Ctx.account, gasPrice: 4000000000 })
      .once('sending', () => {
        setMetaMaskOpened(true)
      })
      .on('transactionHash', (hash) => {
        setMetaMaskOpened(false)
        addToast(
          'Awesome, you have successfully minted your purchased tokens',
          {
            appearance: 'success',
          },
        )
      })
      .on('receipt', (receipt) => {
        tokenCtx.loadTotalSupply(tokenCtx.contract)
        tokenCtx.loadActivePeriod(tokenCtx.contract)
        tokenCtx.loadPeriods(tokenCtx.contract)
        tokenCtx.loadActivity(userCtx.contract)
        tokenCtx.loadMinimumTokens(tokenCtx.contract)
        tokenCtx.loadTokenPrice(tokenCtx.contract)
        setTimeout(() => navigate('/mint'), 1000)
      })
      .on('error', (e) => {
        addToast('Something went wrong with the mint', {
          appearance: 'error',
        })
        setMetaMaskOpened(false)
      })
  }

  const Complete = () => (
    <div className="text-center">
      <h4 className="text-center fw-bold text-uppercase letter-spacing-0">
        Currently there isn't an active ICO round.
      </h4>
    </div>
  )

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed || (tokenCtx.activePeriod && !tokenCtx.activePeriod.status)) {
      return <Complete />
    } else {
      return (
        <>
          <div className="py-4 py-lg-0">
            <button
              className="btn btn-danger m-3 position-absolute top-0 end-0 d-flex align-items-center justify-content-center btn-sm"
              onClick={deactivatePeriodHandler}
              disabled={Boolean(userCtx.appOwner !== web3Ctx.account)}
              ref={setTriggerRef}
            >
              <TiCancel size="1.5rem" />
            </button>
            <div
              ref={setTooltipRef}
              {...getTooltipProps({
                className: 'tooltip-container tooltip-visible',
              })}
            >
              <div {...getArrowProps({ className: 'tooltip-arrow' })} />
              Deactivate Period
            </div>
          </div>
          <h4 className="text-center fw-bold text-uppercase letter-spacing-0">
            {tokenCtx.activePeriod &&
            tokenCtx.activePeriod.startTime > Date.now()
              ? 'Our ICO will be open soon!'
              : tokenCtx.activePeriod &&
                tokenCtx.activePeriod.startTime <= Date.now()
              ? 'Our ICO is now open!!'
              : null}
          </h4>
          <div className="countdown">
            <div className="countdown-item">
              <div className="countdown-item-number">{days}</div>
              <span>Days</span>
            </div>
            <div className="countdown-item">
              <div className="countdown-item-number">{hours}</div>
              <span>Hours</span>
            </div>
            <div className="countdown-item">
              <div className="countdown-item-number">{minutes}</div>
              <span>Mins</span>
            </div>
            <div className="countdown-item">
              <div className="countdown-item-number">{seconds}</div>
              <span>Secs</span>
            </div>
          </div>

          {tokenCtx.activePeriod &&
          tokenCtx.activePeriod.status &&
          tokenCtx.activePeriod.startTime <= Date.now() ? (
            <div className="row mt-5">
              <div className="col-lg-8 mx-auto">
                {tokenCtx.activePeriod.remainingTokens !== '0' ? (
                  <form onSubmit={handleSumbit(onSubmit)}>
                    <div className="p-2 rounded-lg bg-light">
                      <input
                        type="number"
                        className={`${
                          errors.requestedTokenAmount ? 'is-invalid' : null
                        } form-control`}
                        id="basicInput"
                        min="0"
                        max={tokenHardcap}
                        step="any"
                        placeholder="Enter an amount more than nil"
                        {...register('requestedTokenAmount', {
                          required: true,
                          min: minimumTokens,
                          max: tokenHardcap,
                        })}
                      />
                      {errors.requestedTokenAmount && (
                        <span className="invalid-feedback mb-2">
                          Minimum purchased amount must be between {'  '}
                          {minimumTokens.toFixed(15)} and {tokenHardcap}
                        </span>
                      )}
                      {userCtx.usersList &&
                      userCtx.usersList.some(
                        (user) => user.account === web3Ctx.account,
                      ) ? (
                        <button
                          type="submit"
                          className="btn btn-primary w-100 mt-2"
                        >
                          Purchase Token
                        </button>
                      ) : (
                        <Link
                          to="my-info"
                          className="btn btn-primary w-100 mt-2"
                        >
                          Register anonymously first to take part!
                        </Link>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="alert alert-teal d-inline-block px-lg-5">
                      <p className="mb-0 lead fw-normal d-flex align-items-center">
                        <BsCalendar2CheckFill className="me-2" />
                        All tokens have been sold!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </>
      )
    }
  }

  return (
    <>
      {metaMaskOpened ? <MetaMaskLoader /> : null}
      <div
        className="card shadow-lg px-3 pt-3"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <div className="card-body p-lg-5">
          {tokenCtx.activePeriod && tokenCtx.activePeriod.startTime === '0' ? (
            <Complete />
          ) : (
            <Countdown
              date={
                tokenCtx.activePeriod &&
                tokenCtx.activePeriod.startTime > Date.now()
                  ? parseInt(tokenCtx.activePeriod.startTime)
                  : tokenCtx.activePeriod &&
                    tokenCtx.activePeriod.startTime <= Date.now()
                  ? parseInt(tokenCtx.activePeriod.endTime)
                  : Date.now() + 1000000
              }
              renderer={renderer}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default BuyForm
