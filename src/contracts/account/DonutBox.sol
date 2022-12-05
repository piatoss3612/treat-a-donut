// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

error BalanceDepositOverflow();
error BalanceWithdrawOverflow();

contract DonutBox {
    enum BoxState {
        Disactivated,
        Activated
    }

    struct Box {
        uint256 balance;
        BoxState state;
    }

    mapping(address => Box) private _boxes;

    event DonutBoxActivated(address indexed user, uint256 timestamp);
    event DonutBoxDeactivated(address indexed user, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);

    function _activateBox(address _user) internal virtual {
        _boxes[_user].state = BoxState.Activated;
    }

    function _deactivateBox(address _user) internal virtual {
        _boxes[_user].state = BoxState.Disactivated;
    }

    function _isBoxActivated(
        address _user
    ) internal view virtual returns (bool) {
        return _boxes[_user].state == BoxState.Activated;
    }

    function _deposit(address _user, uint256 _amount) internal virtual {
        unchecked {
            uint256 balance = _boxes[_user].balance;
            uint256 deposited = balance + _amount;
            if (deposited < balance) revert BalanceDepositOverflow();
            _boxes[_user].balance = deposited;
        }
    }

    function _withdraw(address _user, uint256 _amount) internal virtual {
        unchecked {
            uint256 balance = _boxes[_user].balance;
            if (_amount > balance) revert BalanceWithdrawOverflow();
            _boxes[_user].balance = balance - _amount;
        }
    }

    function _boxOf(address _user) internal view virtual returns (Box memory) {
        return _boxes[_user];
    }

    function _balanceOf(address _user) internal view virtual returns (uint256) {
        return _boxes[_user].balance;
    }
}
