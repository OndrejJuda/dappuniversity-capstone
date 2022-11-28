const { ethers } = require('hardhat');

async function main() {
  // fetch contract
  const Token = await ethers.getContractFactory('Token');
  const Exchange = await ethers.getContractFactory('Exchange');

  // fetch accounts
  const [deployer, feeAccount] = await ethers.getSigners();

  // deploy contract
  const dapp = await Token.deploy('Dapp University', 'DAPP', '1000000');
  await dapp.deployed();
  console.log(`DAPP Token Deployed to: ${dapp.address}`);

  const mweth = await Token.deploy('Mock Wrapped Ether', 'mWETH', '1000000');
  await mweth.deployed();
  console.log(`mWETH Token Deployed to: ${mweth.address}`);

  const mdai = await Token.deploy('Mock Dai', 'mDAI', '1000000');
  await mdai.deployed();
  console.log(`mDAI Token Deployed to: ${mdai.address}`);

  const exchange = await Exchange.deploy(feeAccount.address, 10);
  await exchange.deployed();
  console.log(`Exchange Deployed to: ${exchange.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
