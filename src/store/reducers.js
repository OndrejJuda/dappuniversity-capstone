export const provider = (state = {}, action) => {
  switch (action.type) {
    case 'PROVIDER_LOADED':
      return {
        ...state,
        connection: action.connection
      };
    case 'NETWORK_LOADED':
      return {
        ...state,
        chainId: action.chainId
      };
    case 'ACCOUNT_LOADED':
      return {
        ...state,
        account: action.address
      };
    case 'ETHER_BALANCE_LOADED':
      return {
        ...state,
        balance: action.balance
      };
    default:
      return state;
  }
};

const DEFAULT_TOKES_STATE = {
  loaded: false,
  contracts: [],
  symbols: []
};

export const tokens = (state = DEFAULT_TOKES_STATE, action) => {
  switch (action.type) {
    case 'TOKEN_LOADED':
      if (state.contracts.length === 2) {
        return {
          ...state,
          loaded: true,
          contracts: [action.token],
          symbols: [action.symbol]
        }
      }
      return {
        ...state,
        loaded: true,
        contracts: [...state.contracts, action.token],
        symbols: [...state.symbols, action.symbol]
      }
    default:
      return state;
  }
};

export const exchange = (state = { loaded: false, contract: {} }, action) => {
  switch (action.type) {
    case 'EXCHANGE_LOADED':
      return {
        ...state,
        loaded: true,
        contract: action.exchange,
      };
    default:
      return state;
  }
}
