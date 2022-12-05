// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./auth/Ownable.sol";
import "./DonutConnector.sol";
import "./utils/ReentrancyGuard.sol";

contract TreatADonut is Ownable, DonutConnector, ReentrancyGuard {
    constructor() Ownable() {
        register();
    }

    function register() public {
        address newUser = msg.sender;

        require(!_isUser(newUser), "yet a valid user");

        _register(newUser);

        emit UserRegistered(newUser, true, block.timestamp);

        _activateBox(newUser);

        emit DonutBoxActivated(newUser, block.timestamp);
    }

    function unregister() external onlyUser {
        require(!_isOwner(), "not allowed for owner");

        address userToDelete = msg.sender;

        _unregister(userToDelete);

        emit UserUnregistered(userToDelete, true, block.timestamp);

        _deactivateBox(userToDelete);

        emit DonutBoxDeactivated(userToDelete, block.timestamp);
    }

    function activateBox() external onlyUser {
        require(!_isBoxActivated(msg.sender), "yet a activated box");

        _activateBox(msg.sender);

        emit DonutBoxActivated(msg.sender, block.timestamp);
    }

    function deactivateBox() external onlyUser {
        require(_isBoxActivated(msg.sender), "not activated box");

        _deactivateBox(msg.sender);

        emit DonutBoxDeactivated(msg.sender, block.timestamp);
    }

    function supportDonut(
        address _to,
        uint256 _amount,
        string memory _message
    ) external payable {
        require(_amount > 0, "zero amount not allowed");

        address from = msg.sender;

        require(_to != from, "supporting yourself not allowed");
        require(_isUser(_to), "not a valid user");
        require(_isBoxActivated(_to), "not activated box");

        uint256 totalPayment = _calculateTotalPayment(_amount);
        require(msg.value >= totalPayment, "not enough payment");

        _transferExceptFee(_to, totalPayment);
        _addSupportReceipt(from, _to, _amount, _message);

        emit DonutSupported(from, _to, _amount, _message, block.timestamp);
    }

    function withdraw(uint256 _amount) external onlyUser lock {
        require(_amount > 0, "zero amount not allowed");

        address user = msg.sender;

        require(_isBoxActivated(user), "not activated box");
        require(_balanceOf(user) >= _amount, "not enough balance");

        _withdraw(user, _amount);

        emit Withdrawn(user, _amount, block.timestamp);
    }

    function getReceiptsOfSupporter(
        address _supporter
    ) external view returns (SupportReceipt[] memory) {
        return _getReceiptsOfSupporter(_supporter);
    }

    function getReceiptsOfBeneficiary(
        address _beneficiary
    ) external view returns (SupportReceipt[] memory) {
        return _getReceiptsOfBeneficiary(_beneficiary);
    }

    function isUser(address _user) external view returns (bool) {
        return _isUser(_user);
    }

    function getUsers() external view returns (address[] memory) {
        return _getUsers();
    }

    function boxOf(address _user) external view returns (Box memory) {
        return _boxOf(_user);
    }

    function destroyContract() external onlyOwner lock {
        _settleDonutBoxes();

        selfdestruct(payable(address(this)));
    }
}
