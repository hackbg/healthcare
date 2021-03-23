// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
//pragma solidity >=0.6.0 <0.7.0;

contract Insurance {
  address public owner;

  struct Patient {
    bool isDegenerated;
    uint256 amountInsurance;
  }

  mapping(address => Patient) private patients;
  mapping(address => bool) public doctors;
  mapping(address => bool) public insurers;

  constructor()
    public
  {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(owner == msg.sender);
    _;
  }

  function setDoctor(address _address)
    public
    onlyOwner
  {
    require(!doctors[_address]);
    doctors[_address] = true;
  }

  function setInsurer(address _address)
    public
    onlyOwner
  {
    require(!insurers[_address]);
    insurers[_address] = true;
  }

  function setPatientData(uint256 _amountInsured)
    public
    returns(address)
  {
    require(insurers[msg.sender]);
    address uniqueId = address(uint160(uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp)))));
    require(patients[uniqueId].isDegenerated == false);
    patients[uniqueId].isDegenerated = true;
    patients[uniqueId].amountInsurance = _amountInsured;

    return uniqueId;
  }

  function useInsurance(address _uniqueId, uint256 _amountUsed)
    public
    returns(string memory)
  {
    require(doctors[msg.sender]);

    if(patients[_uniqueId].amountInsurance < _amountUsed) {
      revert("Not enough amount");
    }
  
    patients[_uniqueId].amountInsurance -= _amountUsed;
    return "Insurance has been used successfuly";
  }

}
