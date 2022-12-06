# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat node
```

### Test

```
$ npx hardhat test
$ npx hardhat test --trace
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
> The analysis was completed successfully. No issues were detected.
```

### Deployment

```shell
$ npx hardhat run scripts/deploy.js --network goerli
```