import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract, utils } from 'ethers';

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] GatekeeperOne', function () {
  let deployer: SignerWithAddress;
  let GatekeeperOne: Contract, GatekeeperOneAttacker: Contract;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

    [deployer] = await ethers.getSigners();

    GatekeeperOne = await (
      await ethers.getContractFactory('GatekeeperOne')
    ).deploy();
  });

  it('Execution', async function () {
    /** CODE YOUR SOLUTION HERE */
    GatekeeperOneAttacker = await (
      await ethers.getContractFactory('GatekeeperOneAttacker')
    ).deploy(GatekeeperOne.address);
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

    expect(await GatekeeperOne.entrant()).to.eq(deployer.address);
  });
});
