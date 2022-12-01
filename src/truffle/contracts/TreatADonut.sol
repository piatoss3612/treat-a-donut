// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./donation/SupportDonut.sol";
import "./Accounts.sol";
import "./utils/ReentrancyGuard.sol";

contract TreatADonut is Accounts, SupportDonut, ReentrancyGuard {
    constructor() Owner() {
        register();
    }

    function register() public {
        require(!_isUser(msg.sender), "yet a valid user");
        _register(msg.sender);

        emit UserRegistered(msg.sender, true, block.timestamp);
        emit DonutBoxActivated(msg.sender, block.timestamp);
    }

    function unregister() external onlyUser(msg.sender) {
        require(!_isOwner(), "not allowed for owner");

        _unregister(msg.sender);

        emit UserUnregistered(msg.sender, true, block.timestamp);
        emit DonutBoxDeactivated(msg.sender, block.timestamp);
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
        uint256 amount
    ) external onlyUser(msg.sender) onlyActivatedBox(msg.sender) lock {
        require(amount > 0, "zero amount not allowed");
        require(_balanceOf(msg.sender) >= amount, "not enough balance");

        _withdraw(msg.sender, amount);

        emit Withdrawn(msg.sender, amount, block.timestamp);
    }

    function supportDonut(
        address to,
        uint256 amount,
        string memory message
    ) external payable onlyUser(to) onlyActivatedBox(to) {
        require(amount > 0, "zero amount not allowed");
        require(msg.value >= DONUT * amount, "not enough payment");

        _transfer(to, amount);
        _addSupportReceipt(msg.sender, to, amount, message);

        emit DonutSupported(msg.sender, to, amount, block.timestamp);
    }

    function _transfer(address to, uint256 amount) private {
        uint256 total = DONUT * amount;
        uint256 fee = _calculateBaseFee(total);
        total -= fee;
        _deposit(to, total);
    }

    function getReceiptsOfSupporter(
        address supporter
    ) external view returns (SupportReceipt[] memory) {
        return _getReceiptsOfSupporter(supporter);
    }

    function getReceiptsOfBeneficiary(
        address beneficiary
    ) external view returns (SupportReceipt[] memory) {
        return _getReceiptsOfBeneficiary(beneficiary);
    }

    function isUser(address _user) external view returns (bool) {
        return _isUser(_user);
    }

    function getUsers() external view returns (address[] memory) {
        return _getUsers();
    }

    function boxOf(address user) external view returns (Box memory) {
        return _boxOf(user);
    }

    function destroyContract() external onlyOwner lock {
        _settleDonutBoxes();

        selfdestruct(payable(address(this)));
    }
}
