# Treat A Donut

This project is simple donation dapp.


### Run front-end

```shell
$ npm install
$ npm start
```

### Run Test

```
$ npx hardhat test
$ npx hardhat test --trace
$ npx hardhat test --fulltrace
```

### Test Coverage

```shell
$ npx hardhat coverage
```

### Contract Sizer

```shell
$ npx hardhat size-contracts
```

### Documentation

```shell
$ npx hardhat dodoc
```

### Security Analysis

```shell
$ docker pull mythril/myth
$ docker run -v "$(pwd)/src/contracts:/tmp" mythril/myth analyze /tmp/TreatADonut.sol
```
```shell
> The analysis was completed successfully. No issues were detected.
```

### Smart Contract Deployment

If you want to deploy the smart contract on your own,
copy `.env.example`, create `.env`, then fill out blanks

```.env
COINMARKETCAP_API_KEY=
ETHERSCAN_API_KEY=
ALCHEMY_URL=
GOERLI_PRIVATE_KEY=
```

```shell
$ npx hardhat run scripts/deploy.js --network goerli
```

---

### Dependencies

#### Smart Contract

- [hardhat](https://github.com/NomicFoundation/hardhat)
- [openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [solidity-coverage](https://github.com/sc-forks/solidity-coverage)
- [contract-sizer](https://github.com/ItsNickBarry/hardhat-contract-sizer)
- [hardhat-tracer](https://github.com/zemse/hardhat-tracer)
- [@primitivefi/hardhat-dodo](https://github.com/primitivefinance/primitive-dodoc)

#### Web App

- [react](https://github.com/facebook/react/)
- [react-router](https://github.com/remix-run/react-router)
- [react-bootstrap](https://github.com/react-bootstrap/react-bootstrap)
- [ethers](https://github.com/ethers-io/ethers.js/)
- [dotenv](https://github.com/motdotla/dotenv)
- [javascript-time-ago](https://github.com/catamphetamine/javascript-time-ago)


#### API

- [DiceBear Avatars](https://github.com/dicebear/dicebear)