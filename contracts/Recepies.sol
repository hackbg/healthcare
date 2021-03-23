// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
//pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Recepies is ERC721  {

  address public owner;
  uint256 public tokenCounter;
  mapping(address => bool) public doctors;
  mapping(address => bool) public pharmacies;

  constructor()
    public
    ERC721 ("Recepie", "DRG")
  {
    tokenCounter = 0;
    owner = msg.sender;
  }

  function setDoctor(address _address)
    public
    onlyOwner
  {
    require(!doctors[_address]);
    doctors[_address] = true;
  }

  function setPharmacy(address _address)
    public
    onlyOwner
  {
    require(!pharmacies[_address]);
    pharmacies[_address] = true;
  }

  function createRecepie(string memory medicines, address patient)
    public
    returns(uint256)
  {
    require(doctors[msg.sender]);
    require(!doctors[patient]);
    require(!pharmacies[patient]);
    uint256 newItemId = tokenCounter;
    _safeMint(patient, newItemId);
    _setTokenURI(newItemId, medicines);
    tokenCounter = tokenCounter + 1;
    return newItemId;
  }

  function _transfer(address from, address to, uint256 tokenId)
    internal
    override
  {
    require(pharmacies[to]);
    require(!pharmacies[from]);
    require(!doctors[from]);
    _transfer(from, to, tokenId);
  }

  modifier onlyOwner() {
    require(owner == msg.sender);
    _;
  }

}