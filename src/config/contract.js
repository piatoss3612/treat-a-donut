import abi from "../truffle/build/contracts/TreatADonut.json";

const GoerliNetworkId = "5";
const GanacheNetworkId = "5777";

export const ContractAddress = abi.networks[GoerliNetworkId].address;
export const ContractAbi = abi.abi;
