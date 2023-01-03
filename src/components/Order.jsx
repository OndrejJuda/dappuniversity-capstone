import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeOrder } from '../store/interactions';

const Order = () => {
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [isBuy, setIsBuy] = useState(true);

  const dispatch = useDispatch();
  const { contracts: tokenContracts } = useSelector(({ tokens }) => tokens);
  const { contract: exchangeContract } = useSelector(({ exchange }) => exchange);
  const { connection: provider } = useSelector(({ provider }) => provider);

  const tabHandler = () => {
    setIsBuy((prevValue) => !prevValue);
  }

  const valuesToZero = () => { setAmount(0); setPrice(0); }

  const orderHandler = (event) => {
    event.preventDefault();

    makeOrder(
      provider,
      exchangeContract,
      tokenContracts,
      {
        amount,
        price,
        type: isBuy ? 'buy' : 'sell'
      },
      dispatch
    );

    valuesToZero();
  };

  return (
    <div className="component exchange__orders">
      <div className='component__header flex-between'>
        <h2>New Order</h2>
        <div className='tabs' onClick={tabHandler}>
          <button className={`tab ${isBuy ? 'tab--active' : ''}`}>Buy</button>
          <button className={`tab ${isBuy ? '' : 'tab--active'}`}>Sell</button>
        </div>
      </div>

      <form onSubmit={orderHandler}>
        <label htmlFor='amount'>{isBuy ? 'Buy Amount' : 'Sell Amount'}</label>
        <input
          type="text"
          id='amount'
          onChange={(event) => setAmount(+event.target.value || 0)}
          value={amount}
        />

        <label htmlFor='price'>{isBuy ? 'Buy Price' : 'Sell Price'}</label>
        <input
          type="text"
          id='price'
          onChange={(event) => setPrice(+event.target.value || 0)}
          value={price}
        />

        <button className='button button--filled' type='submit'>
          <span>{isBuy ? 'Buy Order' : 'Sell Order'}</span>
        </button>
      </form>
    </div>
  );
};

export default Order;