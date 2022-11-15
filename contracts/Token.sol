// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Token {
  string public name;

  constructor(string memory _name) {
    name = _name;
  }
}
