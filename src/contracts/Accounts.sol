// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./account/User.sol";
import "./account/DonutBox.sol";

/**
 * @title Accounts Management
 * @dev Contract module which provides integrated management of user and donut box.
 *
 * This module is used through inheritance.
 */
abstract contract Accounts is User, DonutBox {
    /**
     * @inheritdoc DonutBox
     * @dev Transfers withdrawn balance to user with call function.
     *
     * If call function fails, returns withdrawn balance to the box of user.
     */
    function _withdraw(
        address _user,
        uint256 _amount
    ) internal override(DonutBox) {
        super._withdraw(_user, _amount);
        (bool ok, ) = payable(_user).call{value: _amount}("");
        if (!ok) {
            _deposit(_user, _amount);
            revert("failed to withdraw balance");
        }
    }

    /**
     * @dev Settles all available balance from the box of `_user`
     * @param _user address of user
     */
    function _settleDonutBox(address _user) internal {
        uint256 balance = _balanceOf(_user);
        if (balance > 0) {
            _withdraw(_user, balance);
        }
    }

    /**
     * * @dev Settles donut boxes of all users
     */
    function _settleDonutBoxes() internal {
        address[] memory users = _getUsers();

        for (uint256 i = 0; i < users.length; i++) {
            _settleDonutBox(users[i]);
        }
    }
}
