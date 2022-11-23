const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => ethers.utils.parseEther(n.toString());

describe('Exchange', () => {
  let exchange,
    deployer,
    feeAccount,
    user1,
    token1,
    token2,
    transaction,
    result,
    amount;

  const feePercent = 10;

  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    deployer = accounts[0];
    feeAccount = accounts[1];
    user1 = accounts[2];

    const Exchange = await ethers.getContractFactory('Exchange');
    exchange = await Exchange.deploy(feeAccount.address, feePercent);
    await exchange.deployed();

    const Token = await ethers.getContractFactory('Token');
    token1 = await Token.deploy('Dapp University', 'DAPP', '1000000');
    await token1.deployed();

    token2 = await Token.deploy('Mock Dai', 'mDAI', '1000000');
    await token1.deployed();

    transaction = await token1.connect(deployer).transfer(user1.address, tokens(100));
    result = await transaction.wait();
  });

  describe('Deployment', () => {
    it('tracks the fee account', async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    })

    it('tracks the fee percent', async () => {
      expect(await exchange.feePercent()).to.equal(feePercent);
    })
  });

  describe('Depositing Tokens', () => {
    amount = tokens(100);

    describe('Success', () => {
      beforeEach(async () => {
        transaction = await token1.connect(user1).approve(exchange.address, amount);
        result = await transaction.wait();

        transaction = await exchange.connect(user1).depositToken(token1.address, amount);
        result = await transaction.wait();
      });

      it('tracks the token deposit', async () => {
        expect(await token1.balanceOf(exchange.address)).to.equal(amount);
        expect(await exchange.tokens(token1.address, user1.address)).to.equal(amount);
      });

      it('emits a deposit event', async () => {
        const { event, args: { _token, _user, _amount, _balance } } = result.events.find(({ event }) => event === 'Deposit');

        expect(event).to.equal('Deposit');
        expect(_token).to.equal(token1.address);
        expect(_user).to.equal(user1.address);
        expect(_amount).to.equal(amount);
        expect(_balance).to.equal(amount);
      });
    });

    describe('Failure', () => {
      it('fails when no tokens are approved', async () => {
        await expect(exchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted;
      });
    });
  });

  describe('Withdrawing Tokens', () => {
    amount = tokens(100);

    describe('Success', () => {
      beforeEach(async () => {
        // deposit tokens
        transaction = await token1.connect(user1).approve(exchange.address, amount);
        result = await transaction.wait();

        transaction = await exchange.connect(user1).depositToken(token1.address, amount);
        result = await transaction.wait();

        // withdraw tokens
        transaction = await exchange.connect(user1).withdrawToken(token1.address, amount);
        result = await transaction.wait();
      });

      it('withdraws token funds', async () => {
        expect(await token1.balanceOf(exchange.address)).to.equal(0);
        expect(await exchange.tokens(token1.address, user1.address)).to.equal(0);
        expect(await token1.balanceOf(user1.address)).to.equal(amount);
      });

      it('emits a withdraw event', async () => {
        const { event, args: { _token, _user, _amount, _balance } } = result.events.find(({ event }) => event === 'Withdraw');

        expect(event).to.equal('Withdraw');
        expect(_token).to.equal(token1.address);
        expect(_user).to.equal(user1.address);
        expect(_amount).to.equal(amount);
        expect(_balance).to.equal(0);
      });
    });

    describe('Failure', () => {
      it('fails for insufficient balance', async () => {
        await expect(exchange.connect(user1).withdrawToken(token1.address, amount)).to.be.reverted;
      });
    });
  });

  describe('Making orders', () => {
    let amount = tokens(1);

    describe('Success', () => {
      beforeEach(async () => {
        // deposit tokens
        transaction = await token1.connect(user1).approve(exchange.address, amount);
        result = await transaction.wait();

        transaction = await exchange.connect(user1).depositToken(token1.address, amount);
        result = await transaction.wait();

        // make order
        transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount);
        result = await transaction.wait();
      });

      it('tracks newly created order', async () => {
        expect(await exchange.orderCount()).to.equal(1);
      });

      it('emits an order event', async () => {
        const { event, args: { _id, _user, _tokenGet, _amountGet, _tokenGive, _amountGive, _timestamp } } = result.events.find(({ event }) => event === 'Order');

        expect(event).to.equal('Order');
        expect(_id).to.equal(1);
        expect(_user).to.equal(user1.address);
        expect(_tokenGet).to.equal(token2.address);
        expect(_amountGet).to.equal(amount);
        expect(_tokenGive).to.equal(token1.address);
        expect(_amountGive).to.equal(amount);
        expect(_timestamp).at.least(1);
      });
    });

    describe('Failure', () => {

    });
  });
});
