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
  symbols: [],
  balances: [],
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
        };
      }
      return {
        ...state,
        loaded: true,
        contracts: [...state.contracts, action.token],
        symbols: [...state.symbols, action.symbol]
      };
    case 'TOKEN_BALANCE_LOADED':
      if (state.balances.length === 2) {
        return {
          ...state,
          balances: [action.balance]
        };
      }
      return {
        ...state,
        balances: [...state.balances, action.balance]
      };
    default:
      return state;
  }
};

const DEFAULT_EXCHANGE_STATE = {
  loaded: false,
  contract: {},
  balances: [],
  transaction: {},
  events: [],
};

export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
  switch (action.type) {
    case 'EXCHANGE_LOADED':
      return {
        ...state,
        loaded: true,
        contract: action.exchange,
      };
    case 'EXCHANGE_TOKEN_BALANCE_LOADED':
      if (state.balances.length === 2) {
        return {
          ...state,
          balances: [action.balance]
        }
      }
      return {
        ...state,
        balances: [...state.balances, action.balance]
      }
    case 'TRANSFER_REQUEST':
      return {
        ...state,
        transaction: {
          transactionType: 'Transfer',
          isPending: true,
          isSuccessful: false,
          isError: false,
        },
      }
    case 'TRANSFER_SUCCESS':
      return {
        ...state,
        transaction: {
          transactionType: 'Transfer',
          isPending: false,
          isSuccessful: true,
          isError: false,
        },
        events: [...state.events, action.event ]
      }
    case 'TRANSFER_FAIL':
      return {
        ...state,
        transaction: {
          transactionType: 'Transfer',
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      }
    default:
      return state;
  }
}
