// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

error UserIndexToAddressNotMatched();

abstract contract User {
    address[] private _users;

    mapping(address => bool) private _registered;
    mapping(address => uint256) private _userIndex;

    event UserRegistered(address user, bool success, uint256 timestamp);
    event UserUnregistered(address user, bool success, uint256 timestamp);

    modifier onlyUser() {
        require(_isUser(msg.sender), "not a valid user");
        _;
    }

    function _register(address _newUser) internal virtual {
        _registered[_newUser] = true;

        _users.push(_newUser);
        _userIndex[_newUser] = _users.length - 1;
    }

    function _unregister(address _userToDelete) internal virtual {
        uint256 index = _userIndex[_userToDelete];

        if (_users[index] != _userToDelete)
            revert UserIndexToAddressNotMatched();

        _registered[_userToDelete] = false;

        _users[index] = _users[_users.length - 1];
        _userIndex[_users[_users.length - 1]] = index;

        _users.pop();
        delete _userIndex[_userToDelete];
    }

    function _isUser(address _addr) internal view virtual returns (bool) {
        return _registered[_addr];
    }

    function _getUsers() internal view virtual returns (address[] memory) {
        return _users;
    }
}
