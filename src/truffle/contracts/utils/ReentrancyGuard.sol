// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

abstract contract ReentrancyGuard {
    bool private locked;

    modifier lock() {
        require(!locked, "reentrency not allowed");
        locked = true;
        _;
        locked = false;
    }
}
