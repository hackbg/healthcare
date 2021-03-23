//const { BN } = require('@openzeppelin/test-helpers'); //TODO: delete after if is not used
const { assert } = require('chai');

const Insurance = artifacts.require('Insurance');

let insuranceInstance;

contract('Insurance', (accounts) => {
  it('Should deploy Insurance contract', async() => {
    insuranceInstance = await Insurance.deployed();
    const result = await insuranceInstance.owner();
    assert.equal(result, accounts[0], 'Unable to make first account owner.');
  });

});
