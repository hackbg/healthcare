// SPDX-License-Identifier: MIT
pragma solidity >=0.7.5 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

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

  function createIncurance(uint256 amount, address patient)
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

// contract Insurance {
//   address public owner;

//   struct Patient {
//     bool isDegenerated;
//     uint256 amountInsurance;
//   }

//   mapping(address => Patient) private patients; //number of insurance
//   mapping(address => bool) public doctors;
//   mapping(address => bool) public insurers;

//   constructor() {
//     owner = msg.sender;
//   }

//   modifier onlyOwner() {
//     require(owner == msg.sender);
//     _;
//   }

//   function setDoctor(address _address)
//     public
//     onlyOwner
//   {
//     require(!doctors[_address]);
//     doctors[_address] = true;
//   }

//   function setInsurer(address _address)
//     public
//     onlyOwner
//   {
//     require(!insurers[_address]);
//     insurers[_address] = true;
//   }

//   function setPatientData(uint256 _amountInsured)
//     public
//     returns(address)
//   {
//     require(insurers[msg.sender]);
//     address uniqueId = address(uint160(uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp)))));
//     require(patients[uniqueId].isDegenerated == false);
//     patients[uniqueId].isDegenerated = true;
//     patients[uniqueId].amountInsurance = _amountInsured;

//     return uniqueId;
//   }

//   function useInsurance(address _uniqueId, uint256 _amountUsed)
//     public
//     returns(string memory)
//   {
//     require(doctors[msg.sender]);
//     if(patients[_uniqueId].amountInsurance < _amountUsed) {
//       revert('Not enough amount');
//     }

//     patients[_uniqueId].amountInsurance -= _amountUsed;
//     return 'Insurance has been used successfully';
//   }
// }
