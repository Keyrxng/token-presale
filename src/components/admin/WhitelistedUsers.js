import React, { useContext, useEffect, useState, useMemo } from 'react'
import { Jazzicon } from '@ukstv/jazzicon-react'
import swal from 'sweetalert'
import { HiArrowDown } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import Web3Context from '../../store/web3-context'
import TokenContext from '../../store/token-context'
import UserContext from '../../store/user-context'
import AOS from 'aos'
import MetaMaskLoader from '../common/MetaMaskLoader'

function WhitelistedUsers() {
  const tokenCtx = useContext(TokenContext)
  const web3Ctx = useContext(Web3Context)
  const userCtx = useContext(UserContext)
  const [metaMaskOpened, setMetaMaskOpened] = useState(false)
  const [rendered, setRendered] = useState(1)

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  const whitelist = useMemo(() => {
    if (userCtx.whitelist && userCtx.usersList) {
      return userCtx.whitelist
        .filter(
          (el) => el.address !== '0x0000000000000000000000000000000000000000',
        )
        .map((user) => {
          return {
            account: user.address,
            name: userCtx.usersList
              .filter((el) => el.account === user.address)
              .map((el) => el.codeName)[0],
          }
        })
    }
  }, [userCtx.whitelist, userCtx.usersList])

  function removeFromWhitelistHandler(address, name) {
    tokenCtx.contract.methods
      .removeFromWhitelist(address)
      .send({ from: web3Ctx.account })
      .once('sending', function (payload) {
        setMetaMaskOpened(true)
      })
      .on('transactionHash', (hash) => {
        setMetaMaskOpened(false)
        swal(`Awesome, you have removed ${name} from the whitelist`, {
          appearance: 'success',
        })
      })
      .on('receipt', (receipt) => {
        userCtx.loadWhitelist(userCtx.contract)
        tokenCtx.loadActivity(userCtx.contract)
      })
      .on('error', (e) => {
        swal(`Something went wrong removing ${name} from the whitelist`, {
          appearance: 'error',
        })
        setMetaMaskOpened(false)
      })
  }

  return (
    <>
      {metaMaskOpened ? <MetaMaskLoader /> : null}
      <div className="card shadow-lg" data-aos="fade-up" data-aos-delay="200">
        <div className="card-body p-lg-5">
          <h2 className="h4">Whitelisted Users</h2>
          {whitelist
            ? whitelist.slice(0, rendered).map((el, index) => {
                return (
                  <div
                    className="rounded-lg bg-gray-100 d-flex align-items-center p-3 my-1"
                    key={index}
                  >
                    <Link to={`/users/${el.account}`}>
                      <div style={{ width: '40px', height: '40px' }}>
                        <Jazzicon address={el.account} />
                      </div>
                    </Link>
                    <Link to={`/users/${el.account}`} className="text-reset">
                      <p className="mx-3 mb-0 fw-bold text-primary">
                        {el.name}
                      </p>
                    </Link>
                    <div className="ms-auto">
                      <button
                        className="btn btn-danger btn-sm m-1"
                        onClick={() =>
                          removeFromWhitelistHandler(el.account, el.name)
                        }
                        disabled={
                          userCtx.appOwner !== web3Ctx.account ? true : false
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })
            : null}

          {whitelist && whitelist.length > rendered && (
            <p className="pt-2 mb-0 text-sm">
              Expand To See
              <span className="fw-bold text-primary mx-1">
                {whitelist.length - rendered}
              </span>
              more...
            </p>
          )}
          {!whitelist ||
            (whitelist.length === 0 && (
              <div className="rounded-lg bg-gray-100 d-flex align-items-center p-3 my-1">
                There's no whitelisted users!
              </div>
            ))}
          {whitelist && whitelist.length > rendered && (
            <button
              type="button"
              className="card-expand"
              onClick={() => setRendered(whitelist.length)}
            >
              <HiArrowDown />
              <span className="ms-2">Expand</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default WhitelistedUsers
