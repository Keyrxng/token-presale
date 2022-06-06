import React, { useEffect } from 'react'
import { appSettings } from '../../lib/settings'
import AOS from 'aos'

function NetworkAlert() {
  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  return (
    <div className="fullscreen-loader intro-loader">
      <div className="fullscreen-loader-inner">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto text-center">
              <img
                src="/metamask.png"
                alt="Testnet"
                className="mb-4"
                width="80"
              />
              <h1 className="h3 mb-1">
                This Demo runs on{' '}
                <span className="text-orange orange text-backline">
                  BSC Testnet
                </span>
              </h1>
              <p className="text-muted fw-normal mb-4">
                Please switch network to{' '}
                <span className="tezt-primary fw-bold">
                  {appSettings.activeNetworkName}
                </span>{' '}
                to test the demo
              </p>
              <a
                href="https://autofarm.gitbook.io/autofarm-network/how-tos/defi-beginners-guide/switching-networks-on-metamask"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary py-2"
              >
                How to switch network
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetworkAlert
