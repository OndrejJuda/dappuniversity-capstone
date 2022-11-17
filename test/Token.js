const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => ethers.utils.parseEther(n.toString());

describe('Token', () => {
  let token, accounts, deployer, receiver;
  const name = 'Dapp University';
  const symbol = 'DAPP';
  const decimals = 18;
  const totalSupply = 1_000_000;

  // beforeEach(async () => {
  //   const Token = await ethers.getContractFactory('Token');
  //   token = await Token.deploy();
  // });

  describe('Deployment', () => {
    it('deploys', async () => {
      const Token = await ethers.getContractFactory('Token');
      token = await Token.deploy(name, symbol, totalSupply);
      await token.deployed();

      accounts = await ethers.getSigners()
      deployer = accounts[0];
      receiver = accounts[1];
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

  describe('Sending Tokens', () => {
    const amount = tokens(100);
    let transaction, result;

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await token.connect(deployer).transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it('transfers token balances', async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it('emits a transfer event', async () => {
        const { event, args: { _from, _to, _value } } = result.events[0];

        expect(event).to.equal('Transfer');
        expect(_from).to.equal(deployer.address);
        expect(_to).to.equal(receiver.address);
        expect(_value).to.equal(amount);
      });
    });

    describe('Failure', () => {
      it('fails on insufficient balance', async () => {
        const invalidAmount = tokens(1_000_000_000);
        await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted;
      });

      it('rejects invalid recipient', async () => {
        const invalidAmount = tokens(100);
        await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', invalidAmount)).to.be.reverted;
      });
    });
  });
});
