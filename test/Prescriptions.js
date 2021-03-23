const { assert } = require('chai');

const Prescriptions = artifacts.require('Prescriptions');

let prescriptionInstance;

contract('Prescriptions', (accounts) => {
  it('Should deploy Prescriptions contract', async () => {
    prescriptionInstance = await Prescriptions.deployed();
    const result = await prescriptionInstance.owner();
    assert.equal(result, accounts[0], 'Unable to make first account owner.');
  });
});
