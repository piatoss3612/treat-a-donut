import abi from "../artifacts/src/contracts/TreatADonut.sol/TreatADonut.json";

const GoerliNetworkId = "5";

export const ContractAddress = abi.networks[GoerliNetworkId].address;
export const ContractAbi = abi.abi;
