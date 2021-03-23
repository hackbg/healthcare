const Insurance = artifacts.require('Insurance');
const Prescriptions = artifacts.require('Prescriptions');
const Medicines = artifacts.require('Medicines');

module.exports = function (deployer) {
  deployer.deploy(Insurance);
  deployer.deploy(Prescriptions);
  deployer.deploy(Medicines);
};
