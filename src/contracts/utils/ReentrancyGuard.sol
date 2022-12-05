// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

abstract contract ReentrancyGuard {
    bool private _locked;

    modifier lock() {
        require(!_locked, "reentrency detected");
        _locked = true;
        _;
        _locked = false;
    }
}
