// SPDX-License-Identifier: MIT
pragma solidity >=0.7.5 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// to deploy from Remix change the import
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/token/ERC20/ERC20.sol";

contract Insurance is ERC20 {
  address public owner;
  mapping(address => bool) public insurers;
  mapping(address => bool) public doctors;

  constructor()
    ERC20("Insurance", "Ins")
  {
    owner = msg.sender;
  }

  function setInsurer(address _address)
    public
    onlyOwner
  {
    require(!insurers[_address]);
    insurers[_address] = true;
  }

  function setDoctor(address _address)
    public
    onlyOwner
  {
    require(!doctors[_address]);
    doctors[_address] = true;
  }

  function createInsurance(uint256 amount, address patient)
    public
    returns(uint256)
  {
    require(insurers[msg.sender]);
    require(!insurers[patient]);
    require(!doctors[patient]);
    _mint(patient, amount);
  }

  function _transfer(address from, address to, uint256 tokenId)
    internal
    override
  {
    require(doctors[to]);
    require(!doctors[from]);
    require(!insurers[from]);
    super._transfer(from, to, tokenId);
  }

  modifier onlyOwner() {
    require(owner == msg.sender);
    _;
  }
}
