// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

error TotalPaymentCalculationOverflow();
error BaseFeeCalculationToZero();

abstract contract Support {
    uint256 public constant DONUT = 0.003 ether;

    struct SupportReceipt {
        address from;
        address to;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    SupportReceipt[] private _supportReceipts;
    mapping(address => uint256[]) private _receiptIndicesOfSupporter;
    mapping(address => uint256[]) private _receiptIndicesOfBeneficiary;

    event DonutSupported(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    function _calculateTotalPayment(
        uint256 _amount
    ) internal pure returns (uint256) {
        unchecked {
            uint256 totalPayment = DONUT * _amount;
            if (totalPayment / _amount != DONUT)
                revert TotalPaymentCalculationOverflow();
            return totalPayment;
        }
    }

    function _calculateBaseFee(
        uint256 _payment
    ) internal pure returns (uint256) {
        unchecked {
            uint fee = _payment / 100;
            if (fee == 0) revert BaseFeeCalculationToZero();
            return fee;
        }
    }

    function _addSupportReceipt(
        address _from,
        address _to,
        uint256 _amount,
        string memory _message
    ) internal {
        SupportReceipt memory newReceipt = SupportReceipt(
            _from,
            _to,
            _amount,
            _message,
            block.timestamp
        );

        _supportReceipts.push(newReceipt);

        uint256 receiptIndex = _supportReceipts.length - 1;

        _receiptIndicesOfSupporter[_from].push(receiptIndex);
        _receiptIndicesOfBeneficiary[_to].push(receiptIndex);
    }

    function _getReceiptsOfSupporter(
        address _supporter
    ) internal view returns (SupportReceipt[] memory) {
        uint256[] memory indices = _receiptIndicesOfSupporter[_supporter];

        SupportReceipt[] memory result = new SupportReceipt[](indices.length);

        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = _supportReceipts[indices[i]];
        }

        return result;
    }

    function _getReceiptsOfBeneficiary(
        address _beneficiary
    ) internal view returns (SupportReceipt[] memory) {
        uint256[] memory indices = _receiptIndicesOfBeneficiary[_beneficiary];

        SupportReceipt[] memory result = new SupportReceipt[](indices.length);

        for (uint256 i = 0; i < indices.length; i++) {
            result[i] = _supportReceipts[indices[i]];
        }

        return result;
    }
}
