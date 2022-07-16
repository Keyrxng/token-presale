import React, { useEffect, useContext } from 'react'
import UserContext from '../store/user-context'
import TokenContext from '../store/token-context'
import { FaBitcoin } from 'react-icons/fa'
import { toEther } from '../lib/utils'
import AOS from 'aos'

import BuyForm from './common/BuyForm'
import FetchingDataLoader from './common/FetchingDataLoader'

function Home() {
  const tokenCtx = useContext(TokenContext)
  const userCtx = useContext(UserContext)

  useEffect(() => {
    console.log(userCtx, tokenCtx)
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  if (userCtx.userIsLoading) {
    return <FetchingDataLoader />
  }

  return (
    <>
      <div className="row my-5 gy-5 align-items-center">
        <div className="col-lg-6">
          <h1 data-aos="fade-up" className="text-xl token-title">
            DemoToken Presale
          </h1>
          <p
            className="token-intro-text lead"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Token bio of sorts, a way to advertise prospective selling points
          </p>
        </div>
        <div className="col-lg-6">
          <img
            src="/ils_13.svg"
            alt="Illustration"
            className="img-fluid w-100 mb-5"
            cata-aos="fade-up"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-8">
          <div className="row">
            <div className="col-lg-4">
              <div className="card shadow-lg mb-4" data-aos="fade-up">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="stats-icon red">
                      <FaBitcoin size="1.4rem" className="text-white" />
                    </div>
                    <div className="ms-3">
                      <h6 className="text-muted mb-0">Sold Tokens</h6>
                      <h6 className="h4 fw-normal mb-0">
                        {tokenCtx.activePeriod && tokenCtx.activePeriod.status
                          ? parseInt(
                              tokenCtx.activePeriod.tokenAmount / 10 ** 18,
                            ) -
                            parseInt(
                              tokenCtx.activePeriod.remainingTokens / 10 ** 18,
                            )
                          : 'Not Set'}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="card shadow-lg mb-4"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="card-body">
                  <div className="d-flex">
                    <div className="stats-icon green">
                      <FaBitcoin size="1.4rem" className="text-white" />
                    </div>
                    <div className="ms-3">
                      <h6 className="text-muted mb-0">Available tokens</h6>
                      <h6 className="h4 fw-normal mb-0">
                        {tokenCtx.activePeriod && tokenCtx.activePeriod.status
                          ? Math.round(
                              tokenCtx.activePeriod.remainingTokens / 10 ** 18,
                            )
                          : 0}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="card shadow-lg mb-4"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="card-body">
                  <div className="d-flex">
                    <div className="stats-icon purple">
                      <FaBitcoin size="1.4rem" className="text-white" />
                    </div>
                    <div className="ms-3">
                      <h6 className="text-muted mb-0">Token Price</h6>
                      <h6 className="h4 fw-normal mb-0">
                        {tokenCtx.tokenPrice && tokenCtx.activePeriod.status ? (
                          <span>
                            {toEther(parseFloat(tokenCtx.tokenPrice))} Ether
                          </span>
                        ) : (
                          'Not set'
                        )}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <BuyForm />
        </div>
      </div>
    </>
  )
}

export default Home
