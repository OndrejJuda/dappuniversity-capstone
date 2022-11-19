const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => ethers.utils.parseEther(n.toString());

describe('Token', () => {
  let token,
    accounts,
    deployer,
    receiver,
    exchange,
    transaction,
    result;
  const name = 'Dapp University';
  const symbol = 'DAPP';
  const decimals = 18;
  const totalSupply = 1_000_000;
  const amount = tokens(100);

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
      console.log(deployer)
      receiver = accounts[1];
      exchange = accounts[2];
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

  describe('Approving Tokens', () => {
    beforeEach(async () => {
      transaction = await token.connect(deployer).approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe('Success', () => {
      it('allocates an allowance for delegated token spending', async () => {
        expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount);
      });

      it('emits an Approval event', async () => {
        const { event, args: { _owner, _spender, _value } } = result.events[0];

        expect(event).to.equal('Approval');
        expect(_owner).to.equal(deployer.address)
        expect(_spender).to.equal(exchange.address)
        expect(_value).to.equal(amount)
      });
    });

    describe('Failure', () => {
      it('rejects invalid spenders', async () => {
        await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted;
      });
    });
  });
});
