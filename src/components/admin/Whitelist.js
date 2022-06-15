import React, { useEffect, useState, useContext } from 'react'
import { AiFillInfoCircle } from 'react-icons/ai'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useToasts } from 'react-toast-notifications'
import Select from 'react-select'
import TokenContext from '../../store/token-context'
import Web3Context from '../../store/web3-context'
import UserContext from '../../store/user-context'
import AOS from 'aos'
import MetaMaskLoader from '../common/MetaMaskLoader'

function Whitelist() {
  const tokenCtx = useContext(TokenContext)
  const web3Ctx = useContext(Web3Context)
  const userCtx = useContext(UserContext)
  const [metaMaskOpened, setMetaMaskOpened] = useState(false)
  const { addToast } = useToasts()
  const [usersList, setUsersList] = useState(null)
  const [chosenAddress, setChosenAddress] = useState('')

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  const ListItem = ({ address, name }) => {
    return (
      <div className="d-flex align-items-center">
        <div
          style={{
            minWidth: '25px',
            width: '25px',
            height: '25px',
            flexShrink: '0',
          }}
        >
          <Jazzicon address={address} className="w-100 h-100" />
        </div>
        <div className="ms-2 flex-grow-0">{name}</div>
      </div>
    )
  }

  useEffect(() => {
    if (userCtx.usersList && !userCtx.whitelist) {
      const appUsers = userCtx.usersList
        .filter((user) => user.account !== userCtx.appOwner)
        .map((user) => {
          return {
            value: user.account,
            label: <ListItem address={user.account} name={user.codeName} />,
          }
        })
      setUsersList(appUsers)
    } else if (userCtx.usersList && userCtx.whitelist) {
      const appUsers = userCtx.usersList
        .filter((user) => user.account !== userCtx.appOwner)
        .filter(
          (user) =>
            !userCtx.whitelist.map((el) => el.address).includes(user.account),
        )
        .map((user) => {
          return {
            value: user.account,
            label: <ListItem address={user.account} name={user.codeName} />,
          }
        })
      setUsersList(appUsers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCtx.usersList, userCtx.whitelist])

  function addToWhitelistHandler(e) {
    e.preventDefault()
    if (chosenAddress !== '' && usersList.indexOf(chosenAddress) !== -1) {
      tokenCtx.contract.methods
        .addToWhitelist(chosenAddress.value)
        .send({ from: web3Ctx.account })
        .once('sending', function (payload) {
          setMetaMaskOpened(true)
        })
        .on('transactionHash', (hash) => {
          setChosenAddress('')
          setMetaMaskOpened(false)
          addToast('Awesome, you have added a user to the whitelist', {
            appearance: 'success',
          })
        })
        .on('receipt', (receipt) => {
          userCtx.loadWhitelist(uesrCtx.contract)
          tokenCtx.loadActivity(userCtx.contract)
        })
        .on('error', (e) => {
          addToast('Something went wrong adding to whitelist', {
            appearance: 'error',
          })
          setMetaMaskOpened(false)
        })
    }
  }

  return (
    <>
      {metaMaskOpened ? <MetaMaskLoader /> : null}
      <div className="card shadow-lg" data-aos="fade-up" data-aos-delay="200">
        <div className="card-body p-lg-5">
          <h2 className="h4">Add to Whitelist</h2>
          <h6 className="mb-3">Choose from existing users</h6>
          <form onSubmit={addToWhitelistHandler}>
            {usersList && (
              <>
                <Select
                  searchable
                  options={usersList}
                  className="mb-3"
                  classNamePrefix="select"
                  value={chosenAddress}
                  onChange={setChosenAddress}
                  noOptionsMessage={() => 'No users available'}
                />
                {chosenAddress !== '' ? (
                  <p className="small bg-gray-200 text-gray-700 rounded px-3 py-1 mb-3">
                    {chosenAddress.value}
                  </p>
                ) : null}
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={userCtx.appOwner !== web3Ctx.account ? true : false}
                >
                  Add User
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  )
}

export default Whitelist
