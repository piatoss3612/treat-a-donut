// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./donation/Support.sol";
import "./Accounts.sol";

error BaseFeeExceptionOverflow();

/**
 * @title Contract Connector
 * @dev Contract module which connects Accounts Contract and Support Contract.
 *
 * This module is used through inheritance.
 */
abstract contract DonutConnector is Accounts, Support {
    /**
     * @dev Transfers payment except 1% of base fee
     * @param _to address of receiver
     * @param _payment supported amount from sender
     */
    function _transferExceptFee(
        address _to,
        uint256 _payment
    ) internal virtual {
        unchecked {
            uint256 fee = _calculateBaseFee(_payment);
            if (fee > _payment) revert BaseFeeExceptionOverflow();
            _payment -= fee;
            _deposit(_to, _payment);
        }
    }
}
