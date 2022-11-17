const { ethers } = require('hardhat');
const { expect } = require('chai');


describe('Token', () => {
  let token;
  const name = 'Dapp University';
  const symbol = 'DAPP';
  const decimals = 18;
  const totalSupply = 1_000_000;

  // beforeEach(async () => {
  //   const Token = await ethers.getContractFactory('Token');
  //   token = await Token.deploy();
  // });

  describe('Deployment', () => {
    it('deployes', async () => {
      const Token = await ethers.getContractFactory('Token');
      token = await Token.deploy(name, symbol, totalSupply);
      await token.deployed();
    });

    it('has correct name', async () => {
      expect(await token.name()).to.equal(name);
    });

    it('has correct symbol', async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it('has correct decimals', async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it('has correct total supply', async () => {
      const value = ethers.utils.parseEther(totalSupply.toString());
      expect(await token.totalSupply()).to.equal(value);
    });
  });
});
