const Insurance = artifacts.require('Insurance');
const Recepies = artifacts.require('Recepies');
const Medicines = artifacts.require('Medicines');

module.exports = function (deployer) {
  deployer.deploy(Insurance);
  deployer.deploy(Recepies);
  deployer.deploy(Medicines);
};
