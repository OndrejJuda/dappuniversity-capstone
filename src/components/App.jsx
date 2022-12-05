import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAccount, loadNetwork, loadProvider, loadToken } from '../store/interactions';

import config from '../config.json';


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadBlockchainData = async () => {
      await loadAccount(dispatch);
  
      // connect ethers to blockchain
      const provider = loadProvider(dispatch);
      const chainId = await loadNetwork(provider, dispatch);
  
      // Toke smart contract
      await loadToken(provider, config[chainId].DApp.address, dispatch);
    };

    loadBlockchainData();
  }, [dispatch]);

  

  return (
    <div>
      {/* Navbar */}
      <main className='exchange grid'>
        <section className='exchange__section--left grid'>
          {/* Markets */}
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