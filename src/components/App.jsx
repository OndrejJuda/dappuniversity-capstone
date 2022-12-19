import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAccount, loadNetwork, loadProvider, loadTokens, loadExchange } from '../store/interactions';
import { Navbar, Markets } from './';

import config from '../config.json';


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadBlockchainData = async () => {
      // Connect ethers to blockchain
      const provider = loadProvider(dispatch);
      const chainId = await loadNetwork(provider, dispatch);

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('accountsChanged', () => {
        loadAccount(provider, dispatch);
      });

      const dappAddress = config[chainId].DApp.address;
      const mwethAddress = config[chainId].mWETH.address;
      await loadTokens(provider, [dappAddress, mwethAddress], dispatch);

      const exchangeAddress = config[chainId].exchange;
      await loadExchange(provider, exchangeAddress, dispatch);
    };

    loadBlockchainData();
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <main className='exchange grid'>
        <section className='exchange__section--left grid'>
          <Markets />
          {/* Balance */}
          {/* Order */}
        </section>
        <section className='exchange__section--right grid'>
          {/* PriceChart */}
          {/* Transactions */}
          {/* Trades */}
          {/* OrderBook */}
        </section>
      </main>
      {/* Alert */}
    </div>
  );
}

export default App;