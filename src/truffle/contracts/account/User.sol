// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

abstract contract User {
    address[] private _users;

    mapping(address => bool) private _registered;
    mapping(address => uint256) private _userIndexOnList;

    event UserRegistered(address user, bool success, uint256 timestamp);
    event UserUnregistered(address user, bool success, uint256 timestamp);

    modifier onlyUser(address unidentified) {
        require(_isUser(unidentified), "not a valid user");
        _;
    }

    function _register(address newUser) internal virtual {
        _registered[newUser] = true;

        _users.push(newUser);
        _userIndexOnList[newUser] = _users.length - 1;
    }

    function _unregister(address userToDelete) internal virtual {
        uint256 index = _userIndexOnList[userToDelete];

        require(_users[index] == userToDelete, "user not found");

        _registered[userToDelete] = false;

        _users[index] = _users[_users.length - 1];
        _userIndexOnList[_users[_users.length - 1]] = index;

        _users.pop();
        delete _userIndexOnList[userToDelete];
    }

    function _isUser(address user) internal view virtual returns (bool) {
        return _registered[user];
    }

    function _getUsers() internal view virtual returns (address[] memory) {
        return _users;
    }
}
