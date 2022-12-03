// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        _owner = msg.sender;

        emit OwnershipTransferred(address(0), _owner);
    }

    modifier onlyOwner() {
        require(_isOwner(), "only allowed for owner");
        _;
    }

    function _isOwner() internal view virtual returns (bool) {
        return msg.sender == _owner;
    }

    function owner() external view returns (address) {
        return _owner;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        _owner = _newOwner;

        emit OwnershipTransferred(msg.sender, _newOwner);
    }
}
