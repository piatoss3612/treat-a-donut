// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

contract SupportDonut {
    uint256 public constant DONUT = 0.003 ether;

    struct SupportReceipt {
        address from;
        address to;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    SupportReceipt[] private _supportReceipts;
    mapping(address => uint256[]) private _receiptIndexOfSupporter;
    mapping(address => uint256[]) private _receiptIndexOfBeneficiary;

    event DonutSupported(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    function _calculateBaseFee(uint256 amount) internal pure returns (uint256) {
        return amount / 100;
    }

    function _addSupportReceipt(
        address from,
        address to,
        uint256 amount,
        string memory message
    ) internal {
        SupportReceipt memory newReceipt = SupportReceipt(
            from,
            to,
            amount,
            message,
            block.timestamp
        );

        _supportReceipts.push(newReceipt);

        uint256 receiptIndex = _supportReceipts.length - 1;

        _receiptIndexOfSupporter[from].push(receiptIndex);
        _receiptIndexOfBeneficiary[to].push(receiptIndex);
    }

    function _getReceiptsOfSupporter(
        address supporter
    ) internal view returns (SupportReceipt[] memory) {
        uint256[] memory indices = _receiptIndexOfSupporter[supporter];

        SupportReceipt[] memory result = new SupportReceipt[](indices.length);

        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = _supportReceipts[indices[i]];
        }

        return result;
    }

    function _getReceiptsOfBeneficiary(
        address beneficiary
    ) internal view returns (SupportReceipt[] memory) {
        uint256[] memory indices = _receiptIndexOfBeneficiary[beneficiary];

        SupportReceipt[] memory result = new SupportReceipt[](indices.length);

        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = _supportReceipts[indices[i]];
        }

        return result;
    }
}
