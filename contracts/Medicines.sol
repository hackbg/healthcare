// SPDX-License-Identifier: MIT
pragma solidity >=0.7.5 <0.9.0;

contract Medicines {
  address public owner;
  uint32 public medicinesCount;
  mapping(uint32 => string) public medicines;
  mapping(uint32 => bool) public deleted;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(owner == msg.sender);
    _;
  }

  function addMedicine(string memory name)
    public
    onlyOwner
  {
    //require(keccak256(bytes(medicines[id])) == keccak256(bytes("")));
    medicines[medicinesCount] = name;
    medicinesCount++;
  }

  function delMedicine(uint32 id)
    public
    onlyOwner
  {
    deleted[id] = true;
  }
}
