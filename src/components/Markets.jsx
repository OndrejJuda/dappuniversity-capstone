import React from 'react';
import { useSelector } from 'react-redux';

import config from '../config.json';

const Markets = () => {
  const { chainId } = useSelector(({ provider }) => provider);

  let markets = [];

  if (chainId) {
    const tokens = Object.keys(config[chainId])
      .filter((key) =>
        key !== 'exchange' && key !== 'explorerURL'
      );

    for (const primary of tokens) {
      const secondaryArr = tokens.filter((name) => name !== primary);

      for (const secondary of secondaryArr) {
        const invertedPair = markets.find(({ primaryName, secondaryName }) =>
          primaryName === secondary && secondaryName === primary
        );
        if (invertedPair) continue;

        markets.push(
          {
            primaryName: primary,
            primaryAddress: config[chainId][primary].address,
            secondaryName: secondary,
            secondaryAddress: config[chainId][secondary].address,
          }
        );
      }
    }
  }

  return (
    <div className='component exchange__markets'>
      <div className='component__header'>
        <h2>Select Market</h2>
      </div>
      {
        markets.length > 0 ? (
          <select name='markets' id='markets'>
            {
              markets.map(({ primaryName, primaryAddress, secondaryName, secondaryAddress }) => (
                <option
                  key={`${primaryAddress},${secondaryAddress}`}
                  value={`${primaryAddress},${secondaryAddress}`}
                >
                  {primaryName} / {secondaryName}
                </option>
              ))
            }
          </select>
        ) : (
          <div>
            <p>Not deployed to network</p>
          </div>
        )
      }
      <hr />
    </div>
  )
}

export default Markets;