const { assert } = require('chai');

const Recepies = artifacts.require('Recepies');

let recepiesInstance;

contract('Recepies', (accounts) => {
  it('Should deploy Recepies contract', async() => {
    recepiesInstance = await Recepies.deployed();
    const result = await recepiesInstance.owner();
    assert.equal(result, accounts[0], 'Unable to make first account owner.');
  });

});
