const {BN} = require('@openzeppelin/test-helpers');
const {assert} = require('chai');

const Prescriptions = artifacts.require('Prescriptions');

let prescriptionInstance;
let tokenId;
const medicamentNumbers = '0,1,2';

contract('Prescriptions', (accounts) => {
  const [owner, doctor, pharmacy, patient, other_address, other_pharmacy] = accounts; //TODO:change after

  it('Should deploy Prescriptions contract', async () => {
    prescriptionInstance = await Prescriptions.deployed();
    const result = await prescriptionInstance.owner();
    assert.equal(result, owner, 'Unable to make first account owner.');
  });

  it('Add doctor', async () => {
    const result = await prescriptionInstance.setDoctor(doctor);
    assert.ok(result, 'Failed to add doctor');
  });

  it('Check does the doctor address is added', async () => {
    const result = await prescriptionInstance.doctors(doctor);
    assert.equal(result, true, 'The doctor is not added');
  });

  it('Add pharmacy', async () => {
    const result = await prescriptionInstance.setPharmacy(pharmacy);
    assert.ok(result, 'Failed to add pharmacy');
  });

  it('Check does the pharmacy address is added', async () => {
    const result = await prescriptionInstance.pharmacies(pharmacy);
    assert.equal(result, true, 'The pharmacy is not added');
  });

  it('Should fail when trying to create prescription from pharmacy address', async () => {
    try {
      await prescriptionInstance.createPrescription(medicamentNumbers, patient, 1000, {
        from: pharmacy,
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"'
      );
    }
  });

  it('Should fail to create prescription from other address', async () => {
    try {
      await prescriptionInstance.createPrescription(medicamentNumbers, patient, 1000, {
        from: other_address,
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"'
      );
    }
  });

  it("Create prescription from doctor's address", async () => {
    await prescriptionInstance.createPrescription(medicamentNumbers, patient, 1000, {
      from: doctor,
    });
    //tokenOfOwnerByIndex returns the total amount of tokens stored by the contract
    tokenId = await prescriptionInstance.tokenOfOwnerByIndex(patient, 0);
    assert.ok(tokenId, "Can't create prescription");
  });

  it('Check the patient prescription', async () => {
    const result = await prescriptionInstance.ownerOf(tokenId);
    assert.equal(result, patient, "The prescription can't be found in the patient address");
  });

  it('Check does the right medicines are in the prescription', async () => {
    const result = await prescriptionInstance.tokenURI(BN(tokenId));
    assert.equal(result, medicamentNumbers, "The medicine's IDs are not correct");
  });

  it('Should fail when send the prescription from the patient to doctor', async () => {
    try {
      await prescriptionInstance.approve(doctor, tokenId, {from: patient});
      await prescriptionInstance.safeTransferFrom(patient, doctor, tokenId, {
        from: patient,
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"'
      );
    }
  });

  it('Should fail when send the prescription from the patient to random address', async () => {
    try {
      await prescriptionInstance.approve(other_address, tokenId, {from: patient});
      await prescriptionInstance.safeTransferFrom(patient, other_address, tokenId, {
        from: other_address,
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"'
      );
    }
  });

  it('Should fail when send the prescription from the doctor to pharmacy', async () => {
    try {
      await prescriptionInstance.approve(pharmacy, tokenId, {from: doctor});
      await prescriptionInstance.safeTransferFrom(doctor, pharmacy, tokenId, {
        from: pharmacy,
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"'
      );
    }
  });

  it('Should fail when send the prescription from random address to pharmacy', async () => {
    try {
      await prescriptionInstance.approve(pharmacy, tokenId, {from: other_address});
      await prescriptionInstance.safeTransferFrom(other_address, pharmacy, tokenId, {
        from: pharmacy,
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"'
      );
    }
  });

  it('Send the prescription from the patient to the pharmacy', async () => {
    await prescriptionInstance.approve(pharmacy, tokenId, {from: patient});
    const result = await prescriptionInstance.safeTransferFrom(patient, pharmacy, tokenId, {
      from: pharmacy,
    });
    assert.ok(result, "Coldn't transfer from the patient to pharmacy");
  });

  it('Check does the pharmacy is owner of the recepie.', async () => {
    const result = await prescriptionInstance.ownerOf(tokenId);
    assert.equal(result, pharmacy, 'The pharmacy is not an owner');
  });

  it('Check that other pharmacy is not owner of the recepie.', async () => {
    const result = await prescriptionInstance.ownerOf(tokenId);
    assert.notEqual(result, other_pharmacy, 'The pharmacy is not an owner');
  });

  it('Should fail when send try to send prescription to second pharmacy', async () => {
    try {
      await prescriptionInstance.setPharmacy(other_pharmacy);
      await prescriptionInstance.approve(other_pharmacy, tokenId, {from: patient});
      await prescriptionInstance.safeTransferFrom(patient, other_pharmacy, tokenId, {
        from: other_pharmacy,
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'not owner nor approved',
        'The error message should contain "not owner nor approved"'
      );
    }
  });

  it('Should fail when send prescription from first to second pharmacy', async () => {
    try {
      await prescriptionInstance.approve(other_pharmacy, tokenId, {from: pharmacy});
      await prescriptionInstance.safeTransferFrom(pharmacy, other_pharmacy, tokenId, {
        from: other_pharmacy,
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"'
      );
    }
  });

  it('Create prescription that expires on next block', async () => {
    await prescriptionInstance.createPrescription(medicamentNumbers, patient, 1, {
      from: doctor,
    });
    //tokenOfOwnerByIndex returns the total amount of tokens stored by the contract
    tokenId = await prescriptionInstance.tokenOfOwnerByIndex(patient, 0);
    assert.ok(tokenId, "Can't create prescription");
  });

  it('Should fail when send expired the prsescription from the patient to doctor address', async () => {
    try {
      await prescriptionInstance.approve(doctor, tokenId, {from: patient});
      await prescriptionInstance.safeTransferFrom(patient, doctor, tokenId, {
        from: patient,
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'VM Exception',
        'The error message should contain "VM Exception"'
      );
    }
  });
});
