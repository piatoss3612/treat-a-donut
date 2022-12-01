// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

abstract contract DonutBox {
    enum BoxState {
        Disactivated,
        Activated
    }

    struct Box {
        uint256 balance;
        BoxState state;
    }

    mapping(address => Box) private _boxes;

    modifier onlyActivatedBox(address user) {
        require(_isBoxActivated(user), "not activated box");
        _;
    }

    event DonutBoxActivated(address indexed user, uint256 timestamp);
    event DonutBoxDeactivated(address indexed user, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);

    function _activateBox(address user) internal virtual {
        _boxes[user].state = BoxState.Activated;
    }

    function _deactivateBox(address user) internal virtual {
        _boxes[user].state = BoxState.Disactivated;
    }

    function _isBoxActivated(address user)
        internal
        view
        virtual
        returns (bool)
    {
        return _boxes[user].state == BoxState.Activated;
    }

    function _boxOf(address user) internal view virtual returns (Box memory) {
        return _boxes[user];
    }

    function _balanceOf(address user) internal view virtual returns (uint256) {
        return _boxes[user].balance;
    }

    function _deposit(address user, uint256 amount) internal virtual {
        _boxes[user].balance += amount;
    }

    function _withdraw(address user, uint256 amount) internal virtual {
        _boxes[user].balance -= amount;
    }
}
