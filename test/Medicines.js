const { assert } = require('chai');

const Medicines = artifacts.require('Medicines');

let medicinesInstance;

contract('Medicines', (accounts) => {
  it('Should deploy Medicines contract', async() => {
    medicinesInstance = await Medicines.deployed();
    const result = await medicinesInstance.owner();
    assert.equal(result, accounts[0], 'Unable to make first account owner.');
  });

  it('Add medicine', async() => {
    const result = await medicinesInstance.addMedicine('aspirin', {from: accounts[0]});
    assert.ok(result, 'The medicine does not added');
  });

  it('Check first medicine\'s name', async() => {
    const result = await medicinesInstance.medicines(0);
    assert.equal(result, 'aspirin', 'The name of the medicine is not correct');
  });

  it('Add second medicine and check the total number of medicines', async() => {
    await medicinesInstance.addMedicine('analgin', {from: accounts[0]});
    assert.equal(await medicinesInstance.medicinesCount(), 2, 'The total numbers of medicines is not correct.');
  });

  it('id:1000 from the mapping array should be empty', async() => {
    assert.equal(await medicinesInstance.medicines(1000), '', 'id:1000 is not empty');
  });

  it('Can\'t add medicine if not an owner', async() => {
    try {
      await medicinesInstance.addMedicine('vitamin C', {from: accounts[1]});
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'Exception while processing transaction',
        'The error message should contain "Exception while processing transaction"'
      );
    }
  });

});
