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

        if (!_isBoxActivated(newUser)) {
            _activateBox(newUser);

            emit DonutBoxActivated(newUser, block.timestamp);
        }
    }

    function unregister() external onlyUser(msg.sender) {
        require(!_isOwner(), "not allowed for owner");

        address userToDelete = msg.sender;

        _unregister(userToDelete);

        emit UserUnregistered(userToDelete, true, block.timestamp);

        if (_isBoxActivated(userToDelete)) {
            _deactivateBox(userToDelete);

            emit DonutBoxDeactivated(userToDelete, block.timestamp);
        }
    }

    function activateBox() external onlyUser(msg.sender) {
        require(!_isBoxActivated(msg.sender), "yet a activated box");
        _activateBox(msg.sender);

        emit DonutBoxActivated(msg.sender, block.timestamp);
    }

    function deactivateBox()
        external
        onlyUser(msg.sender)
        onlyActivatedBox(msg.sender)
    {
        _deactivateBox(msg.sender);

        emit DonutBoxDeactivated(msg.sender, block.timestamp);
    }

    function withdraw(
        uint256 _amount
    ) external onlyUser(msg.sender) onlyActivatedBox(msg.sender) lock {
        require(_amount > 0, "zero amount not allowed");
        require(_balanceOf(msg.sender) >= _amount, "not enough balance");

        _withdraw(msg.sender, _amount);

        emit Withdrawn(msg.sender, _amount, block.timestamp);
    }

    function supportDonut(
        address _to,
        uint256 _amount,
        string memory _message
    ) external payable onlyUser(_to) onlyActivatedBox(_to) {
        require(_to != msg.sender, "supporting yourself not allowed");
        require(_amount > 0, "zero amount not allowed");

        uint256 totalPayment = _calculateTotalPayment(_amount);
        require(msg.value >= totalPayment, "not enough payment");

        _transferExceptFee(_to, totalPayment);
        _addSupportReceipt(msg.sender, _to, _amount, _message);

        emit DonutSupported(msg.sender, _to, _amount, block.timestamp);
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
