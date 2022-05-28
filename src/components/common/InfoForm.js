import React, { useState, useContext, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import Web3Context from '../../store/web3-context'
import TokenContext from '../../store/token-context'
import UserContext from '../../store/user-context'
import web3 from '../../helpers/web3'
import AOS from 'aos'
import { MetaMaskLoader } from './MetaMaskLoader'
import { useForm } from 'react-hook-form'
import { swal } from 'sweetalert'

function InfoForm({ codeName, setFullName }) {
  const web3Ctx = useContext(Web3Context)
  const userCtx = useContext(UserContext)
  const tokenCtx = useContext(TokenContext)
  const [metaMaskOpened, setMMOpened] = useState(false)

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  function onSubmit(data) {
    if (
      userCtx.usersList &&
      userCtx.usersList
        .filter((user) => user.account !== web3Ctx.account)
        .map((el) => el.codeName.trim())
        .includes(data.codeName.trim())
    ) {
      swal({
        title: 'Naming Error',
        text: 'This code name has already been taken',
        icon: 'warning',
        dangerMode: true,
      })
    } else {
      tokenCtx.contract.methods
        .addUser(web3Ctx.account, data.codeName)
        .send({ from: web3Ctx.account })
        .once('sending', function (payload) {
          setMMOpened(true)
        })
        .on('receipt', (receipt) => {
          userCtx.getUsersList(userCtx.contract, tokenCtx.contract)
          userCtx.getUserInformation(
            userCtx.contract,
            tokenCtx.contract,
            web3Ctx.contract,
          )
          web3Ctx.loadAccount(web3)
        })
        .on('error', (e) => {
          swal({
            title: 'Transaction Error',
            text: 'Transaction Failed! Check the console for more info',
            icon: 'warning',
            dangerMode: true,
          })
          setMMOpened(false)
        })
    }
  }

  return (
    <>
      {metaMaskOpened ? <MetaMaskLoader /> : null}
      <div></div>
    </>
  )
}
