const { BN } = require('@openzeppelin/test-helpers'); //TODO: delete after if is not used
const { assert } = require('chai');

const Insurance = artifacts.require('Insurance');

let insuranceInstance;
let tokenId;

contract('Insurance', (accounts) => {
  it('Should deploy Insurance contract', async () => {
    insuranceInstance = await Insurance.deployed();
    const result = await insuranceInstance.owner();
    assert.equal(result, accounts[0], 'Unable to make first account owner.');
  });

  it('Add doctor', async () => {
    const result = await insuranceInstance.setDoctor(accounts[1]);
    assert.ok(result, 'Failed to add doctor');
  });

  it('Check does the doctor address is added', async () => {
    const result = await insuranceInstance.doctors(accounts[1]);
    assert.equal(result, true, 'The doctor is not added');
  });

  it('Add insurer', async () => {
    const result = await insuranceInstance.setInsurer(accounts[2]);
    assert.ok(result, 'Failed to add insurer');
  });

  it('Check does the insurer address is added', async () => {
    const result = await insuranceInstance.insurers(accounts[2]);
    assert.equal(result, true, 'The insurer is not added');
  });

});

  

  // //TODO: something is wrong here doesn't return uniqueId
  // //try to call setPatientData from insurer address and need to pass - 
  // //save uniqueId in global variable after only from that can take money
  // xit('Add insurance to patient from insurer', async () => {
  //   uniqueId = await insuranceInstance.setPatientData(500, { from: accounts[2] }).then((a) => {
  //     console.log("!!!!!!!!!!!!!!");
  //     console.log(a);
  //   });
  //   //TODO: delete after
  //   // console.log("Unique id");
  //   // console.log(uniqueId);
  //   assert.ok(uniqueId, 'Failed to add insurence');
  // });

  // //the same from doctor's address - need to fail
  // xit('Should fail to add insurance to patient from doctor', async () => {
  //   try {
  //     await insuranceInstance.setPatientData(500, { from: accounts[1] });
  //     assert.fail('The transaction should have thrown an error');
  //   } catch (err) {
  //     assert.include(
  //       err.message,
  //       'VM Exception',
  //       'The error message should contain "VM Exception"',
  //     );
  //   }
  // });

  // //the same from random address that is not here - need to fail
  // xit('Should fail to add insurance to patient from random address', async () => {
  //   try {
  //     await insuranceInstance.setPatientData(500, { from: accounts[3] });
  //     assert.fail('The transaction should have thrown an error');
  //   } catch (err) {
  //     assert.include(
  //       err.message,
  //       'VM Exception',
  //       'The error message should contain "VM Exception"',
  //     );
  //   }
  // });

  // //useInsurance - try to take money from insurer's address - fail
  // xit('Should fail when trying to take insurance from insurar\'s address', async () => {
  //   try {//useInsurance(address _uniqueId, uint256 _amountUsed)
  //     await insuranceInstance.useInsurance(uniqueId, 250, { from: accounts[2] });
  //     assert.fail('The transaction should have thrown an error');
  //   } catch (err) {
  //     assert.include(
  //       err.message,
  //       '???',
  //       'The error message should contain "???"',
  //     );
  //   }
  // });

  // //useInsurance - try to take money from random address - fail
  // xit('Should fail when trying to take insurance from random address', async () => {
  //   try {//useInsurance(address _uniqueId, uint256 _amountUsed)
  //     await insuranceInstance.useInsurance(uniqueId, 250, { from: accounts[3] });
  //     assert.fail('The transaction should have thrown an error');
  //   } catch (err) {
  //     assert.include(
  //       err.message,
  //       '???',
  //       'The error message should contain "???"',
  //     );
  //   }
  // });

  // //useInsurance - try to take money from doctor's address - with more money - fail
  // //it('Should fail when trying to take more money than exist in insurance from doctor\'s address', async () => {

  // //useInsurance - try to take money from doctor's address - half money - success
  // xit('Take half from the existing insurance from doctor\'s address', async () => {
  //   const result = await insuranceInstance.useInsurance(uniqueId, 250, { from: accounts[1] });
  //   assert.ok(result, 'Coldn\'t transfer money from the insurance');
  // });

  //useInsurance - try to take money from doctor's address - more than half money - fail and check that the money decrease
  //it('Should fail when try to take more than half from the initial money from doctor\'s address', async () => {

  //useInsurance - try to take money from doctor's address - take the other half from them oney - success
  //it('Take the other half from the existing insurance from doctor\'s address', async () => {
