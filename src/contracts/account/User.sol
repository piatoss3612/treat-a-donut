// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

error UserIndexToAddressNotMatched();

/**
 * @title User Management
 * @dev Contract module which provides access control to specific accounts registered as user
 *
 * This module is used through inheritance.
 */
abstract contract User {
    address[] private _users;

    mapping(address => bool) private _registered;
    mapping(address => uint256) private _userIndex;

    /**
     * @notice Notifies user registration
     * @param user registered user
     * @param success whether registration success or not
     * @param timestamp timestamp of transaction
     */
    event UserRegistered(address user, bool success, uint256 timestamp);

    /**
     * @notice Notifies user unregistration
     * @param user unregistered user
     * @param success whether unregistration success or not
     * @param timestamp timestamp of transaction
     */
    event UserUnregistered(address user, bool success, uint256 timestamp);

    /// @dev Restricts access to only owner of contract.
    modifier onlyUser() {
        require(_isUser(msg.sender), "not a valid user");
        _;
    }

    /**
     * @dev Registers address of new user
     * and maps `_newUser` to user index of _users array
     * @param _newUser address of new user
     */
    function _register(address _newUser) internal virtual {
        _registered[_newUser] = true;

        _users.push(_newUser);
        _userIndex[_newUser] = _users.length - 1;
    }

    /**
     * @dev Unregisters address of user
     * and deletes stored data related to `_userToDelete`
     * @param _userToDelete address of user to delete
     */
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

    /**
     * @dev Verifies whether `_addr` is registered user or not
     * @param _addr address to verify
     */
    function _isUser(address _addr) internal view virtual returns (bool) {
        return _registered[_addr];
    }

    /**
     * @dev Returns addresses of registered users
     * @return addresses of registered users
     */
    function _getUsers() internal view virtual returns (address[] memory) {
        return _users;
    }
}
