# Healthcare 

**Smart Contracts**

* Insurance
* Medicines
* Prescriptions

⚠️ Smart contracts are not audited. Please do not use in production!

## Overview

This repo includes Solidity smart contracts compatible with EVM-based blockchains

It's built using standard and secure smart contract library [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) vetted by the awesome community.

## Run locally

Clone the repo and:

## Install dependencies

```
$ npm install
```

## Compile

```
$ npx truffle compile
```

## Test

```
$ npx truffle test
```

## Develop

You can deploy your contracts from Remix and add addresses for Doctor, Insurer and Pharmacy from Remix. You need to change the imports for openzeppelin for Insurance and Prescriptions contracts with the ones provided in comments in the contracts or you can deploy using truffle.

You can find instructions in the text bellow how to deploy in truffle and also how to test from custom ganache local network.

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```
2. Install ganache globally
    ```javascript
    npm install -g ganache-cli
    ```
3. Run ganache in separate terminal or in background
    ```javascript
    ganache-cli
    ```

4. Run the development console in different terminal
    ```javascript
    truffle console
    ```

5. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

Find more at the official [Truffle docs](https://www.trufflesuite.com/docs).

## Prepare everything for local test network

### Example addressess for test network:
```
Account 1 - Doctor
Account 2 - Insurer
Account 3 - Patient
Account 4 - Pharmacy
```

### Deploy contracts for test network
```javascript
let insurance = await Insurance.deployed()
let prescriptions = await Prescriptions.deployed()
let medicines = await Medicines.deployed()
```

### Set addresses

Initialise variables for all roles:

```javascript
let doctor = "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
let insurer = "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
let patient = "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
let pharmacy = "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

## Add funds from ganache in your metamask accounts

```javascript
web3.eth.sendTransaction({to: doctor, from: accounts[0], value:web3.utils.toWei("10","ether")});
web3.eth.sendTransaction({to: insurer, from: accounts[0], value:web3.utils.toWei("10","ether")});
web3.eth.sendTransaction({to: patient, from: accounts[0], value:web3.utils.toWei("10","ether")});
web3.eth.sendTransaction({to: pharmacy, from: accounts[0], value:web3.utils.toWei("10","ether")});
```

### Set accounts for insurance:

```javascript
insurance.setDoctor(doctor)
insurance.setInsurer(insurer)
```

### Set accounts for prescriptions:

```javascript
prescriptions.setDoctor(doctor)
prescriptions.setPharmacy(pharmacy)
```

### Add some medicines:
```javascript
medicines.addMedicine("aspirin")
medicines.addMedicine("analgin")
...
```
Add contract addresses in the .env file in the frontend app: [healthcare-ui](https://github.com/hackbg/healthcare-ui)

You can see the ganache contract addresses with:

```javascript
insurance.address
prescriptions.address
medicines.address
```

If the transactions are rejected go in Metamask -> Settings -> Advanced and reset the accounts