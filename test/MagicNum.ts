import { Contract, utils } from 'ethers';

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] MagicNum', function () {
  let MagicNum: Contract, Solver: Contract;

  const initCode = '600a600c600039600a6000F3';
  const runtimeCode = '602a60005260206000F3'; // length = 10

  let contractAddress = '';

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

    MagicNum = await (await ethers.getContractFactory('MagicNum')).deploy();
    Solver = await (await ethers.getContractFactory('Solver')).deploy();
  });

  it('Execution', async function () {
    /** CODE YOUR SOLUTION HERE */
    const [deployer] = await ethers.getSigners();

    // Construct the deployment transaction
    const deploymentTx = {
      to: null,
      data: `0x${initCode}${runtimeCode}`,
    };

    // Send the deployment transaction
    const tx = await deployer.sendTransaction(deploymentTx);

    // Wait for the transaction to be mined
    const receipt = await ethers.provider.getTransactionReceipt(tx.hash);

    // Get the contract address from the transaction receipt
    contractAddress = receipt.contractAddress;

    await MagicNum.setSolver(contractAddress);
  });

  after(async function () {
    /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

    expect(await Solver.contractLength(contractAddress)).to.be.eq(10);
  });
});
