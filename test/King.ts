import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] King', function () {
  let deployer: SignerWithAddress, attackerWallet: SignerWithAddress;
  let king: Contract, kingAttacker: Contract;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

    [deployer, attackerWallet] = await ethers.getSigners();

    king = await (
      await ethers.getContractFactory('King', deployer)
    ).deploy({
      value: ethers.utils.parseEther('1'),
    });

    kingAttacker = await (
      await ethers.getContractFactory('KingAttacker', attackerWallet)
    ).deploy(
      attackerWallet.address,
      king.address // king
    );

    expect(await king._king()).to.eq(deployer.address);
  });

  it('Execution', async function () {
    /** CODE YOUR SOLUTION HERE */

    await kingAttacker
      .connect(attackerWallet)
      .attack({ value: ethers.utils.parseEther('2') });
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */
    expect(await king._king()).to.eq(kingAttacker.address);

    await expect(
      deployer.sendTransaction({
        to: king.address,
        value: ethers.utils.parseEther('3'),
      })
    ).to.be.reverted;
  });
});
