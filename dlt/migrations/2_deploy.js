const DemoPresale = artifacts.require('DemoPresale')
const DemoPresaleToken = artifacts.require('DemoPresaleToken')

module.exports = async function (deployer, account) {
  await deployer.deploy(DemoPresale)
  const SaleI = await DemoPresale.deployed()
  await deployer.deploy(DemoPresaleToken, 'Keyrxng', 'RXNG', SaleI.address)
}
