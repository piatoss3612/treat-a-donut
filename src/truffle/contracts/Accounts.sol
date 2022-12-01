// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./account/Owner.sol";
import "./account/User.sol";
import "./account/DonutBox.sol";

contract Accounts is Owner, User, DonutBox {
    function _register(address newUser) internal override(User) {
        super._register(newUser);
        _activateBox(newUser);
    }

    function _unregister(address userToDelete) internal override(User) {
        super._unregister(userToDelete);
        _deactivateBox(userToDelete);
    }

    function _withdraw(
        address user,
        uint256 amount
    ) internal override(DonutBox) {
        super._withdraw(user, amount);

        (bool ok, ) = payable(user).call{value: amount}("");
        if (!ok) {
            _deposit(user, amount);
            revert("failed to withdraw balance");
        }
    }

    function _settleDonutBox(address user) internal {
        uint256 balance = _balanceOf(user);
        if (balance > 0) {
            _withdraw(user, balance);
        }
    }

    function _settleDonutBoxes() internal {
        address[] memory users = _getUsers();

        for (uint256 i = 0; i < users.length; i++) {
            _settleDonutBox(users[i]);
        }
    }
}
