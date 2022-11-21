const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => ethers.utils.parseEther(n.toString());

describe('Exchange', () => {
  let exchange,
    deployer,
    feeAccount;

  const feePercent = 10;

  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    deployer = accounts[0];
    feeAccount = accounts[1];

    const Exchange = await ethers.getContractFactory('Exchange');
    exchange = await Exchange.deploy(feeAccount.address, feePercent);
    await exchange.deployed();
  });

  describe('Deployment', () => {
    it('tracks the fee account', async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    })

    it('tracks the fee percent', async () => {
      expect(await exchange.feePercent()).to.equal(feePercent);
    })
  });
});

