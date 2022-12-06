// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

/**
 * @title Ownership of Contract
 * @dev Contract module which provides access control only to specific account, owner.
 *
 * This module is used through inheritance.
 */
abstract contract Ownable {
    address private _owner;

    /**
     * @notice Notifies ownership transferral
     * @param previousOwner previous owner
     * @param newOwner new owner
     */
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /// @dev Initializes the deployer of contract as initial owner.
    constructor() {
        _owner = msg.sender;

        emit OwnershipTransferred(address(0), _owner);
    }

    /// @dev Restricts access to only owner of contract.
    modifier onlyOwner() {
        require(_isOwner(), "only allowed for owner");
        _;
    }

    /// @dev Checks if the sender is owner.
    function _isOwner() internal view virtual returns (bool) {
        return msg.sender == _owner;
    }

    /// @notice Returns the address of current owner.
    /// @return address of current owner
    function owner() external view returns (address) {
        return _owner;
    }

    /**
     * @notice Transfers ownership of contract to `_newOwner`.
     *
     * Can only be called by current owner.
     * @param _newOwner address of new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        _owner = _newOwner;

        emit OwnershipTransferred(msg.sender, _newOwner);
    }
}
