const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => ethers.utils.parseEther(n.toString());

describe('Token', () => {
  let token, deployer;
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

      deployer = (await ethers.getSigners())[0];
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
      expect(await token.totalSupply()).to.equal(tokens(totalSupply));
    });

    it('assigns total supply to deployer', async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(tokens(totalSupply));
    });
  });
});
