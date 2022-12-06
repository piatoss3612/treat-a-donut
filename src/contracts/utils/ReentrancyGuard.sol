// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

/**
 * @title Reentrancy Guard
 * @dev Contract module which provides modifier `lock`
 * that prevents sender from re-entrancing function.
 *
 * This module is used through inheritance.
 */
abstract contract ReentrancyGuard {
    bool private _locked;

    /**
     * @dev Prevents sender from re-entrancing function
     * while previous function call is not processed yet.
     */
    modifier lock() {
        require(!_locked, "reentrency detected");
        _locked = true;
        _;
        _locked = false;
    }
}
