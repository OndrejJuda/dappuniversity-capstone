import { useEffect } from 'react';
import { ethers } from 'ethers';

import TOKEN_ABI from '../ABIs/Token.json';
import EXCHANGE_ABI from '../ABIs/Exchange.json';
import config from '../config.json';

import '../App.css';

const App = () => {

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log(account);

    // connect ethers to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();

    // Toke smart contract
    const dappToken = new ethers.Contract(
      config[chainId].DApp.address,
      TOKEN_ABI,
      provider
    );

    console.log(await dappToken.symbol())
  };

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