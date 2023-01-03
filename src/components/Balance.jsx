import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadBalances, transferTokens } from '../store/interactions';

import dapp from '../assets/dapp.svg';
import eth from '../assets/eth.svg';

const Balance = () => {
  const [token0TransferAmount, setToken0TransferAmount] = useState(0);
  const [token1TransferAmount, setToken1TransferAmount] = useState(0);
  const [isDeposit, setIsDeposit] = useState(true);

  const dispatch = useDispatch();
  const { symbols, contracts: tokenContracts, balances: tokenBalances } = useSelector(({ tokens }) => tokens);
  const { contract: exchangeContract, balances: exchangeBalances, transaction: { isPending } } = useSelector(({ exchange }) => exchange);
  const { account, connection: provider } = useSelector(({ provider }) => provider);

  useEffect(() => {
    if (!exchangeContract || tokenContracts?.length === 0 || !account) return;

    loadBalances(exchangeContract, tokenContracts, account, dispatch);
  }, [exchangeContract, tokenContracts, account, dispatch, isPending]);

  const amountHandler = (event, tokenContract) => {
    if (tokenContract === tokenContracts[0]) {
      setToken0TransferAmount(+event.target.value || 0);
    } else {
      setToken1TransferAmount(+event.target.value || 0);
    }
  };

  const depositHandler = (event, tokenContract) => {
    event.preventDefault();

    if (tokenContract === tokenContracts[0]) {
      transferTokens(provider, exchangeContract, 'deposit', tokenContracts[0], token0TransferAmount, dispatch);

      setToken0TransferAmount(0);
    } else {
      transferTokens(provider, exchangeContract, 'deposit', tokenContracts[1], token1TransferAmount, dispatch);

      setToken1TransferAmount(0);
    }
  };

  const withdrawHandler = (event, tokenContract) => {
    event.preventDefault();
    console.log('here')

    if (tokenContract === tokenContracts[0]) {
      transferTokens(provider, exchangeContract, 'withdraw', tokenContracts[0], token0TransferAmount, dispatch);

      setToken0TransferAmount(0);
    } else {
      transferTokens(provider, exchangeContract, 'withdraw', tokenContracts[1], token1TransferAmount, dispatch);

      setToken1TransferAmount(0);
    }
  };

  const tabHandler = () => {
    setIsDeposit((prevValue) => !prevValue);
  }

  return (
    <div className='component exchange__transfers'>
      <div className='component__header flex-between'>
        <h2>Balance</h2>
        <div className='tabs'>
          <button onClick={tabHandler} className={`tab ${isDeposit ? 'tab--active' : ''}`}>Deposit</button>
          <button onClick={tabHandler} className={`tab ${isDeposit ? '' : 'tab--active'}`}>Withdraw</button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (DApp) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p>
            <small>Token</small>
            <br />
            <img src={dapp} alt='Token logo' />
            {symbols[0] ?? ''}
          </p>
          <p>
            <small>Wallet</small>
            <br />
            {tokenBalances && tokenBalances[0]}
          </p>
          <p>
            <small>Exchange</small>
            <br />
            {exchangeBalances && exchangeBalances[0]}
          </p>
        </div>

        <form
          onSubmit={(event) =>
            isDeposit ? depositHandler(event, tokenContracts[0]) : withdrawHandler(event, tokenContracts[0])
          }
        >
          <label htmlFor="token0"></label>
          <input
            type="text"
            id='token0'
            onChange={(event) => amountHandler(event, tokenContracts[0])}
            value={token0TransferAmount}
          />

          <button className='button' type='submit'>
            <span>{isDeposit ? 'Deposit' : 'Withdraw'}</span>
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p>
            <small>Token</small>
            <br />
            <img src={eth} alt='Token logo' />
            {symbols[1] ?? ''}
          </p>
          <p>
            <small>Wallet</small>
            <br />
            {tokenBalances && tokenBalances[1]}
          </p>
          <p>
            <small>Exchange</small>
            <br />
            {exchangeBalances && exchangeBalances[1]}
          </p>
        </div>

        <form
          onSubmit={(event) =>
            isDeposit ? depositHandler(event, tokenContracts[1]) : withdrawHandler(event, tokenContracts[1])
          }
        >
          <label htmlFor="token1"></label>
          <input
            type="text"
            id='token1'
            onChange={(event) => amountHandler(event, tokenContracts[1])}
            value={token1TransferAmount}
          />

          <button className='button' type='submit'>
            <span>{isDeposit ? 'Deposit' : 'Withdraw'}</span>
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
};

export default Balance;