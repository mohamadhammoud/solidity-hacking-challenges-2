import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Denial', function () {
  let deployer: SignerWithAddress;
  let Denial: Contract, DenialAttacker: Contract;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

    [deployer] = await ethers.getSigners();

    Denial = await (
      await ethers.getContractFactory('Denial', deployer)
    ).deploy();

    DenialAttacker = await (
      await ethers.getContractFactory('DenialAttacker', deployer)
    ).deploy(
      Denial.address // Denial
    );

    await Denial.setWithdrawPartner(DenialAttacker.address);
  });

  it('Execution', async function () {
    /** CODE YOUR SOLUTION HERE */

    await expect(await Denial.withdraw()).to.be.rejectedWith('');
  });
});
