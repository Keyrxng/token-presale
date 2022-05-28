import React, { useEffect, useContext } from 'react'
import UserContext from '../store/user-context'
import TokenContext from '../store/token-context'
import { FaBitcoin } from 'react-icons/fa'
import { toEther } from '../helpers/utils'
import AOS from 'aos'

function Home() {
  const tokenCtx = useContext(TokenContext)
  const userCtx = useContext(UserContext)

  useEffect(() => {
    console.log(userCtx, tokenCtx)
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  if (userCtx.userIsLoading) {
    // return<FetchingDataLoader/>
  }
}
