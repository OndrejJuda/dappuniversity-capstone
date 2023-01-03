import { ethers } from 'ethers';
import TOKEN_ABI from '../ABIs/Token.json';
import EXCHANGE_ABI from '../ABIs/Exchange.json';

export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: 'PROVIDER_LOADED', connection });

  return connection;
}

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: 'NETWORK_LOADED', chainId });

  return chainId;
};

export const loadAccount = async (provider, dispatch) => {
  const [account] = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  const address = ethers.utils.getAddress(account);

  dispatch({ type: 'ACCOUNT_LOADED', address });

  const balance = await provider.getBalance(account);
  const formattedBalance = +ethers.utils.formatEther(balance);

  dispatch({ type: 'ETHER_BALANCE_LOADED', balance: formattedBalance });
};

export const loadTokens = async (provider, addresses, dispatch) => {
  for (const address of addresses) {
    const token = new ethers.Contract(address, TOKEN_ABI, provider);
    const symbol = await token.symbol();

    dispatch({ type: 'TOKEN_LOADED', token, symbol });
  }
};

export const loadExchange = async (provider, address, dispatch) => {
  const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);

  dispatch({ type: 'EXCHANGE_LOADED', exchange });
  return exchange;
};

export const substribeToEvents = (exchange, dispatch) => {
  exchange.on('Deposit', (token, user, amount, balance, event) => {
    dispatch({ type: 'TRANSFER_SUCCESS', event })
  });
};

export const loadBalances = async (exchange, tokens, accountAddress, dispatch) => {
  for (const token of tokens) {
    const walletBalance = ethers.utils.formatUnits(await token.balanceOf(accountAddress), 18);
    dispatch({ type: 'TOKEN_BALANCE_LOADED', balance: walletBalance });

    const exchangeBalance = ethers.utils.formatUnits(await exchange.tokens(token.address, accountAddress));
    dispatch({ type: 'EXCHANGE_TOKEN_BALANCE_LOADED', balance: exchangeBalance });
  }
};

export const transferTokens = async (provider, exchange, transferType, token, amount, dispatch) => {
  let transaction;

  dispatch({ type: 'TRANSFER_REQUEST' });

  try {
    const signer = await provider.getSigner();
    const amountToTransfer = ethers.utils.parseUnits(amount.toString(), 18);

    transaction = await token.connect(signer).approve(exchange.address, amountToTransfer);
    await transaction.wait();

    transaction = await exchange.connect(signer).depositToken(token.address, amountToTransfer);
    await transaction.wait();
  } catch (error) {
    console.error(error);
    dispatch({ type: 'TRANSFER_FAIL' });
  }
}