import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Web3Provider from './store/Web3Provider'
import UserProvider from './store/UserProvider'
import TokenProvider from './store/TokenProvider'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Web3Provider>
      <TokenProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </TokenProvider>
    </Web3Provider>
  </React.StrictMode>,
)
