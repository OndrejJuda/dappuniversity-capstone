import { ethers } from 'ethers';
import TOKEN_ABI from '../ABIs/Token.json';

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

export const loadAccount = async (dispatch) => {
  const [account] = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  const address = ethers.utils.getAddress(account);

  dispatch({type: 'ACCOUNT_LOADED', address})
};

export const loadToken = async (provider, address, dispatch) => {
  const token = new ethers.Contract(address, TOKEN_ABI, provider);
  const symbol = await token.symbol();

  dispatch({type: 'TOKEN_LOADED', token, symbol});
}; 
