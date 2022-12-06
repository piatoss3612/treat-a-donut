// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

error BalanceDepositOverflow();
error BalanceWithdrawOverflow();

/**
 * @title DonutBox Management
 * @dev Contract module which provides box that can save balance and change state
 *
 * Can use this contract to implement pull over push pattern.
 *
 * This module is used through inheritance.
 */
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

    /**
     * @notice Notifies donut box activation
     * @param user  user requested donut box activation
     * @param timestamp timestamp of transaction
     */
    event DonutBoxActivated(address indexed user, uint256 timestamp);

    /**
     * @notice Notifies donut box deactivation
     * @param user  user requested donut box deactivation
     * @param timestamp timestamp of transaction
     */
    event DonutBoxDeactivated(address indexed user, uint256 timestamp);

    /**
     * @notice Notifies balance withdrawal
     * @param user  user requested balance withdrawal
     * @param amount balance withdrawn
     * @param timestamp timestamp of transaction
     */
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);

    /**
     * @dev Changes state of donut box of `_user` to activated
     * @param _user address of user requested donut box activation
     */
    function _activateBox(address _user) internal virtual {
        _boxes[_user].state = BoxState.Activated;
    }

    /**
     * @dev Changes state of donut box of `_user` to deactivated
     * @param _user address of user requested donut box deactivation
     */
    function _deactivateBox(address _user) internal virtual {
        _boxes[_user].state = BoxState.Disactivated;
    }

    /**
     * @dev Verifies whether box state of `_user` is activated or not
     * @param _user address of user to verify
     */
    function _isBoxActivated(
        address _user
    ) internal view virtual returns (bool) {
        return _boxes[_user].state == BoxState.Activated;
    }

    /**
     * @dev Deposits `_amount` (wei) to box of `_user`
     * @param _user address of user
     * @param _amount amount to deposit
     */
    function _deposit(address _user, uint256 _amount) internal virtual {
        unchecked {
            uint256 balance = _boxes[_user].balance;
            uint256 afterDeposit = balance + _amount;
            if (afterDeposit < balance) revert BalanceDepositOverflow();
            _boxes[_user].balance = afterDeposit;
        }
    }

    /**
     * @dev Withdraws `_amount` (wei) from box of `_user`
     * @param _user address of user
     * @param _amount amount to withdraw
     */
    function _withdraw(address _user, uint256 _amount) internal virtual {
        unchecked {
            uint256 balance = _boxes[_user].balance;
            if (_amount > balance) revert BalanceWithdrawOverflow();
            _boxes[_user].balance = balance - _amount;
        }
    }

    /**
     * @dev Returns donut box of `_user`
     * @param _user address of user
     */
    function _boxOf(address _user) internal view virtual returns (Box memory) {
        return _boxes[_user];
    }

    /**
     * @dev Returns balance of `_user`
     * @param _user address of user
     */
    function _balanceOf(address _user) internal view virtual returns (uint256) {
        return _boxes[_user].balance;
    }
}
