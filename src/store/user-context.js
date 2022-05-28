import React from 'react'

const UserContext = React.createContext({
  contract: null,
  appOwnerDetails: null,
  userInformation: null,
  usersList: null,
  userBalance: null,
  whitelist: null,
  userInformationError: false,
  usersListError: false,
  userIsLoading: true,
  getUserInformation: () => {},
  getAppOwner: () => {},
  getAppOwnerDetails: () => {},
  loadUserBalance: () => {},
  getUsersList: () => {},
  loadWhitelist: () => {},
  loadContract: () => {},
  setUSerIsLoading: () => {},
})

export default UserContext
