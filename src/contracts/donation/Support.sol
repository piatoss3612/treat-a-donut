// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

error TotalPaymentCalculationOverflow();
error BaseFeeCalculationToZero();

/**
 * @title Donut Support Management
 * @dev Contract module which provides calculations for donut support
 * and stores support receipts.
 *
 * This module is used through inheritance.
 */
abstract contract Support {
    /**
     * @notice fixed price of each donut
     * @return price of donut
     */
    uint256 public constant DONUT = 0.003 ether;

    struct SupportReceipt {
        address from;
        address to;
        uint256 donuts;
        string message;
        uint256 timestamp;
    }

    SupportReceipt[] private _supportReceipts;
    mapping(address => uint256[]) private _receiptIndicesOfSupporter;
    mapping(address => uint256[]) private _receiptIndicesOfBeneficiary;

    /**
     * @notice Notifies donuts have been supported
     * @param from  address of supporter
     * @param to address of beneficiary
     * @param donuts the number of donuts supported
     * @param message message enveloped
     * @param timestamp timestamp of transaction
     */
    event DonutSupported(
        address indexed from,
        address indexed to,
        uint256 donuts,
        string message,
        uint256 timestamp
    );

    /**
     * @dev Returns total payment based on the number of donuts
     * @param _donuts the number of donuts
     * @return total payment
     */
    function _calculateTotalPayment(
        uint256 _donuts
    ) internal pure returns (uint256) {
        unchecked {
            uint256 totalPayment = DONUT * _donuts;
            if (totalPayment / _donuts != DONUT)
                revert TotalPaymentCalculationOverflow();
            return totalPayment;
        }
    }

    /**
     * @dev Returns base fee which is 1% of payment
     * @param _payment payment of support
     * @return base fee
     */
    function _calculateBaseFee(
        uint256 _payment
    ) internal pure returns (uint256) {
        unchecked {
            uint fee = _payment / 100;
            if (fee == 0) revert BaseFeeCalculationToZero();
            return fee;
        }
    }

    /**
     * @dev Stores newly generated receipt on chain and
     * maps the index of receipt to both supporter and beneficiary
     * @param _from  address of supporter
     * @param _to address of beneficiary
     * @param _donuts supported donut amount
     * @param _message message enveloped
     *
     */
    function _addSupportReceipt(
        address _from,
        address _to,
        uint256 _donuts,
        string memory _message
    ) internal {
        SupportReceipt memory newReceipt = SupportReceipt(
            _from,
            _to,
            _donuts,
            _message,
            block.timestamp
        );

        _supportReceipts.push(newReceipt);

        uint256 receiptIndex = _supportReceipts.length - 1;

        _receiptIndicesOfSupporter[_from].push(receiptIndex);
        _receiptIndicesOfBeneficiary[_to].push(receiptIndex);
    }

    /**
     * @dev Returns receipts of `_supporter` stored on chain
     * @param _supporter address of supporter
     * @return result receipts of supporter
     */
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

    /**
     * @dev Returns receipts of `_beneficiary` stored on chain
     * @param _beneficiary address of beneficiary
     * @return result receipts of beneficiary
     */
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
