// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./donation/SupportDonut.sol";
import "./Accounts.sol";

contract DonutConnector is Accounts, SupportDonut {
    function _transferExceptFee(address to, uint256 amount) internal virtual {
        uint256 totalPayment = DONUT * amount;
        uint256 fee = _calculateBaseFee(totalPayment);
        totalPayment -= fee;
        _deposit(to, totalPayment);
    }
}
