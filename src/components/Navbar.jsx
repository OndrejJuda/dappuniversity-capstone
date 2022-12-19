import React from 'react';
import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import { useDispatch } from 'react-redux';
import { loadAccount } from '../store/interactions';

import config from '../config.json';

import logo from '../assets/logo.png';
import eth from '../assets/eth.svg';

const Navbar = () => {
  const dispatch = useDispatch();
  const { account, balance, connection: provider, chainId } = useSelector(({ provider }) => provider);

  const connectHandler = async () => {
    await loadAccount(provider, dispatch);
  };

  const networkHandler = async ({ target: { value: newChainId } }) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: newChainId }],
    });
  };

  return (
    <div className='exchange__header grid'>
      <div className='exchange__header--brand flex'>
        <img
          className='logo'
          src={logo}
          alt='DApp logo'
        />
        <h1>DApp token Exchange</h1>
      </div>

      <div className='exchange__header--networks flex'>
        <img src={eth} alt='ETH Logo' className='Eth Logo' />

        <select
          name='networks'
          id='networks'
          value={config[chainId] ? `0x${chainId.toString(16)}` : '0'}
          onChange={networkHandler}
        >
          <option value='0' disabled>Select Network</option>
          <option value='0x7A69'>Localhost</option>
          <option value='0x5'>Goerli</option>
        </select>
      </div>

      <div className='exchange__header--account flex'>
        {
          balance && (
            <p><small>My Balance</small>{balance.toFixed(4)}</p>
          )
        }
        {
          account ? (
            <a
              href={config[chainId] ? `${config[chainId].explorerURL}/address/${account}` : '#'}
              target='_blank'
              rel='noreferrer'
            >
              {account.slice(0, 5)}...{account.slice(-4, account.length)}
              <Blockies
                seed={account}
                size={10}
                scale={3}
                color='#2187d0'
                bgColor='#f1f2f9'
                spotColor='#767f92'
                className='identicon'
              />
            </a>
          ) : (
            <button
              type='button'
              className='button'
              onClick={connectHandler}
            >
              Connect
            </button>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;