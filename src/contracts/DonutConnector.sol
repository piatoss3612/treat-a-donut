// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./donation/Support.sol";
import "./Accounts.sol";

error BaseFeeExceptionOverflow();

contract DonutConnector is Accounts, Support {
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
