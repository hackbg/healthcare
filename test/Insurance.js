const { BN } = require('@openzeppelin/test-helpers'); //TODO: delete after if is not used
const { assert } = require('chai');

const Insurance = artifacts.require('Insurance');

let insuranceInstance;

contract('Insurance', (accounts) => {

  const [owner, doctor, insurer, patient, other_address, other_doctor] = accounts;

  it('Should deploy Insurance contract', async () => {
    insuranceInstance = await Insurance.deployed();
    const result = await insuranceInstance.owner();
    assert.equal(result, owner, 'Unable to make first account owner.');
  });

  it('Add doctor', async () => {
    const result = await insuranceInstance.setDoctor(doctor);
    assert.ok(result, 'Failed to add doctor');
  });

  it('Check does the doctor address is added', async () => {
    const result = await insuranceInstance.doctors(doctor);
    assert.equal(result, true, 'The doctor is not added');
  });

  it('Add insurer', async () => {
    const result = await insuranceInstance.setInsurer(insurer);
    assert.ok(result, 'Failed to add insurer');
  });

  it('Check does the insurer address is added', async () => {
    const result = await insuranceInstance.insurers(insurer);
    assert.equal(result, true, 'The insurer is not added');
  });

  it('Should fail when trying to create insurance from doctor address', async () => {
    try {
      await insuranceInstance.createInsurance(500, patient, { from: doctor });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Create insurance from other address', async () => {
    try {
      await insuranceInstance.createInsurance(500, patient, { from: other_address });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Create insurance from insurer\'s address', async () => {
    await insuranceInstance.createInsurance(500, patient, { from: insurer })
    //balanceOf returns the total amount of tokens stored by the contract
    const result = await insuranceInstance.balanceOf(patient);
    assert.equal(result, 500, 'Can\'t create prescription');
  });

  it('Check the patient insurance amount', async () => {
    const result = await insuranceInstance.balanceOf(patient);
    assert.equal(result, 500, 'Can\'t create prescription');
  });

  it('Should fail when send the insurance from the patient to insurer', async () => {
    try {
      await insuranceInstance.transfer(insurer, 100, { from: patient });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Should fail when send the insurance from the patient to other address', async () => {
    try {
      await insuranceInstance.transfer(other_address, 100, { from: patient });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Should fail when send the insurance from the insurer to the doctor', async () => {
    try {
      await insuranceInstance.transfer(doctor, 100, { from: insurer });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Should fail when send the insurance from other address to doctor', async () => {
    try {
      await insuranceInstance.transfer(doctor, 100, { from: other_address });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"',
      );
    }
  });

  it('Send the prescription from the patient to the doctor', async () => {
    await insuranceInstance.transfer(doctor, 100, { from: patient });
    const resultPatient = await insuranceInstance.balanceOf(patient);
    assert.equal(resultPatient, 400, 'Coldn\'t transfer from the patient to doctor');

  });

  it('Check does the doctor recieved the payment.', async () => {
    const resultDoctor = await insuranceInstance.balanceOf(doctor);
    assert.equal(resultDoctor, 100, 'Coldn\'t transfer from the patient to doctor');
  });

  it('Should fail when try to send more than available tokens', async () => {
    try {
      await insuranceInstance.transfer(doctor, 500, { from: patient });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'exceeds balance',
        'The error message should contain "exceeds balance"',
      );
    }
  });

  it('Should fail when send tokens from first to second doctor', async () => {
    try{
    await insuranceInstance.setDoctor(other_doctor);
    await insuranceInstance.transfer(other_doctor, 100, { from: doctor });
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
