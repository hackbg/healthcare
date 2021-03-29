const { BN } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');

const Prescriptions = artifacts.require('Prescriptions');

let prescriptionInstance;
let tokenId;
const medicamentNumbers = "0,1,2";

contract('Prescriptions', (accounts) => {
  const [owner, doctor, pharmacy, patient, other_address, other_pharmacy] = accounts; //TODO:change after
  
  it('Should deploy Prescriptions contract', async () => {
    prescriptionInstance = await Prescriptions.deployed();
    const result = await prescriptionInstance.owner();
    assert.equal(result, accounts[0], 'Unable to make first account owner.');
  });

  it('Add doctor', async () => {
    const result = await prescriptionInstance.setDoctor(accounts[1]);
    assert.ok(result, 'Failed to add doctor');
  });

  it('Check does the doctor address is added', async () => {
    const result = await prescriptionInstance.doctors(accounts[1]);
    assert.equal(result, true, 'The doctor is not added');
  });

  it('Add pharmacy', async () => {
    const result = await prescriptionInstance.setPharmacy(accounts[2]);
    assert.ok(result, 'Failed to add pharmacy');
  });

  it('Check does the pharmacy address is added', async () => {
    const result = await prescriptionInstance.pharmacies(accounts[2]);
    assert.equal(result, true, 'The pharmacy is not added');
  });

  it('Should fail when trying to create prescription from pharmacy address', async () => {
    try {
      await prescriptionInstance.createPrescription(medicamentNumbers, accounts[3], 1000, { from: accounts[2] });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Create prescription from other address', async () => {
    try {
      await prescriptionInstance.createPrescription(medicamentNumbers, accounts[3], 1000, { from: accounts[4] });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Create prescription from doctor\'s address', async () => {
    await prescriptionInstance.createPrescription(medicamentNumbers, accounts[3], 1000, { from: accounts[1] })
    //tokenOfOwnerByIndex returns the total amount of tokens stored by the contract
    tokenId = await prescriptionInstance.tokenOfOwnerByIndex(accounts[3], 0);
    assert.ok(tokenId, 'Can\'t create prescription');
  });

  it('Check the patient prescription', async () => {
    const result = await prescriptionInstance.ownerOf(tokenId);
    assert.equal(result, accounts[3],'The prescription can\'t be found in the patient address');
  });

  it('Check does the right medicines are in the prescription', async () => {
    const result = await prescriptionInstance.tokenURI(BN(tokenId));
    assert.equal(result, medicamentNumbers, 'The medicine\'s IDs are not correct');
  });

  it('Should fail when send the prescription from the patient to doctor', async () => {
    try {
      await prescriptionInstance.approve(accounts[1], tokenId, { from: accounts[3] });
      await prescriptionInstance.safeTransferFrom(accounts[3], accounts[1], tokenId, { from: accounts[3] });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Should fail when send the prescription from the patient to random address', async () => {
    try {
      await prescriptionInstance.approve(accounts[4], tokenId, { from: accounts[3] });
      await prescriptionInstance.safeTransferFrom(accounts[3], accounts[4], tokenId, { from: accounts[4] });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Should fail when send the prescription from the doctor to pharmacy', async () => {
    try {
      await prescriptionInstance.approve(accounts[2], tokenId, { from: accounts[1] });
      await prescriptionInstance.safeTransferFrom(accounts[1], accounts[2], tokenId, { from: accounts[2] });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Should fail when send the prescription from random address to pharmacy', async () => {
    try {
      await prescriptionInstance.approve(accounts[2], tokenId, { from: accounts[4] });
      await prescriptionInstance.safeTransferFrom(accounts[4], accounts[2], tokenId, { from: accounts[2] });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Send the prescription from the patient to the pharmacy', async () => {
    await prescriptionInstance.approve(accounts[2], tokenId, { from: accounts[3] });
    const result = await prescriptionInstance.safeTransferFrom(accounts[3], accounts[2], tokenId, { from: accounts[2] });
    assert.ok(result, 'Coldn\'t transfer from the patient to pharmacy');
  });

  it('Check does the pharmacy is owner of the recepie.', async () => {
    const result = await prescriptionInstance.ownerOf(tokenId);
    assert.equal(result, accounts[2], 'The pharmacy is not an owner');
  });

  it('Check that other pharmacy is not owner of the recepie.', async () => {
    const result = await prescriptionInstance.ownerOf(tokenId);
    assert.notEqual(result, accounts[5], 'The pharmacy is not an owner');
  });

  it('Should fail when send try to send prescription to second pharmacy', async () => {
    try {
      await prescriptionInstance.setPharmacy(accounts[5]);
      await prescriptionInstance.approve(accounts[5], tokenId, { from: accounts[3] });
      await prescriptionInstance.safeTransferFrom(accounts[3], accounts[5], tokenId, { from: accounts[5] });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'not owner nor approved',
        'The error message should contain "not owner nor approved"',
      );
    }
  });

  it('Should fail when send prescription from first to second pharmacy', async () => {
    try{
    await prescriptionInstance.approve(accounts[5], tokenId, { from: accounts[2] });
    await prescriptionInstance.safeTransferFrom(accounts[2], accounts[5], tokenId, { from: accounts[5] });
    assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Create prescription that expires on next block', async () => {
    await prescriptionInstance.createPrescription(medicamentNumbers, accounts[3], 1, { from: accounts[1] })
    //tokenOfOwnerByIndex returns the total amount of tokens stored by the contract
    tokenId = await prescriptionInstance.tokenOfOwnerByIndex(accounts[3], 0);
    assert.ok(tokenId, 'Can\'t create prescription');
  });

  it('Should fail when send expired the prsescription from the patient to doctor address', async () => {
    try {
      await prescriptionInstance.approve(accounts[1], tokenId, { from: accounts[3] });
      await prescriptionInstance.safeTransferFrom(accounts[3], accounts[1], tokenId, { from: accounts[3] });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

});
