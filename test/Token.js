const { ethers } = require('hardhat');
const { expect } = require('chai');


describe('Token', () => {
  let token;

  it('deploys', async () => {
    // fetch token from blockchain
    const Token = await ethers.getContractFactory('Token');
    token = await Token.deploy();
    await token.deployed();
  });

  it('has correct name', async () => {
    // read token name
    const name = await token.name();

    // check name correctnes
    expect(name).to.equal('Dapp University');
  });
});
