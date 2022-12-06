// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "./auth/Ownable.sol";
import "./DonutConnector.sol";
import "./utils/ReentrancyGuard.sol";

/**
 * @title Treat A Donut Contract
 * @dev Contract module which provides simple donation functionality.
 * @author piatoss3612
 */
contract TreatADonut is Ownable, DonutConnector, ReentrancyGuard {
    /**
     * @dev Initializes the deployer of contract as initial owner
     *
     * and registers deployer as user of the contract.
     */
    constructor() Ownable() {
        register();
    }

    /**
     * @notice Registers sender as user, and activates box of sender.
     *
     * Already registered user cannot trigger this function.
     */
    function register() public {
        address newUser = msg.sender;

        require(!_isUser(newUser), "yet a valid user");

        _register(newUser);

        emit UserRegistered(newUser, true, block.timestamp);

        _activateBox(newUser);

        emit DonutBoxActivated(newUser, block.timestamp);
    }

    /**
     * @notice Unregisters sender, and deactivates box of sender.
     *
     * Only registered user can trigger this function.
     */
    function unregister() external onlyUser {
        require(!_isOwner(), "not allowed for owner");

        address userToDelete = msg.sender;

        _unregister(userToDelete);

        emit UserUnregistered(userToDelete, true, block.timestamp);

        _deactivateBox(userToDelete);

        emit DonutBoxDeactivated(userToDelete, block.timestamp);
    }

    /**
     * @notice Activates box of sender.
     *
     * Only registered user can trigger this function.
     */
    function activateBox() external onlyUser {
        require(!_isBoxActivated(msg.sender), "yet a activated box");

        _activateBox(msg.sender);

        emit DonutBoxActivated(msg.sender, block.timestamp);
    }

    /**
     * @notice Deactivates box of sender.
     *
     * Only registered user can trigger this function.
     */
    function deactivateBox() external onlyUser {
        require(_isBoxActivated(msg.sender), "not activated box");

        _deactivateBox(msg.sender);

        emit DonutBoxDeactivated(msg.sender, block.timestamp);
    }

    /**
     * @notice Supports donuts to `_to` expect base fee and
     *
     * store receipt of transaction on chain.
     *
     * The number of donuts should not be below zero, and reciever should not be yourself.
     *
     * Receiver should be a valid user with activated box.
     *
     * Value should be greater than or equal to total payment in need.
     * @param _to address of receiver
     * @param _donuts the number of donuts supported
     * @param _message message enveloped from sender
     */
    function supportDonut(
        address _to,
        uint256 _donuts,
        string memory _message
    ) external payable {
        require(_donuts > 0, "zero donut not allowed");

        address from = msg.sender;

        require(_to != from, "supporting yourself not allowed");
        require(_isUser(_to), "not a valid user");
        require(_isBoxActivated(_to), "not activated box");

        uint256 totalPayment = _calculateTotalPayment(_donuts);
        require(msg.value >= totalPayment, "not enough payment");

        _transferExceptFee(_to, totalPayment);
        _addSupportReceipt(from, _to, _donuts, _message);

        emit DonutSupported(from, _to, _donuts, _message, block.timestamp);
    }

    /**
     * @notice Withdraws balance from the box of sender.
     *
     * Only register user can trigger the function and
     *
     * re-entrancy attack is prohibited by `lock` modifier.
     *
     * The amount to withdraw should be greater than zero.
     *
     * The box of sender should be activated and have enough balance.
     * @param _amount amount to withdraw from balance
     */
    function withdraw(uint256 _amount) external onlyUser lock {
        require(_amount > 0, "zero amount not allowed");

        address user = msg.sender;

        require(_isBoxActivated(user), "not activated box");
        require(_balanceOf(user) >= _amount, "not enough balance");

        _withdraw(user, _amount);

        emit Withdrawn(user, _amount, block.timestamp);
    }

    /**
     * @notice Returns receipts of `_supporter` stored on chain
     * @param _supporter address of supporter
     * @return receipts of `_supporter`
     */
    function getReceiptsOfSupporter(
        address _supporter
    ) external view returns (SupportReceipt[] memory) {
        return _getReceiptsOfSupporter(_supporter);
    }

    /**
     * @notice Returns receipts of `_beneficiary` stored on chain
     * @param _beneficiary address of beneficiary
     * @return receipts of `_beneficiary`
     */
    function getReceiptsOfBeneficiary(
        address _beneficiary
    ) external view returns (SupportReceipt[] memory) {
        return _getReceiptsOfBeneficiary(_beneficiary);
    }

    /**
     * @notice Verifies whether `_addr` is registered user or not
     * @param _addr address to verify
     * @return true if `_addr` is user else false
     */
    function isUser(address _addr) external view returns (bool) {
        return _isUser(_addr);
    }

    /**
     * @notice Returns addresses of registered users
     * @return addresses of registered users
     */
    function getUsers() external view returns (address[] memory) {
        return _getUsers();
    }

    /**
     * @notice Returns donut box of `_user`
     * @param _user address of user
     * @return box of `_user`
     */
    function boxOf(address _user) external view returns (Box memory) {
        return _boxOf(_user);
    }

    /**
     * @notice Settles balance of all accounts and destroies contract.
     *
     * Only can triggered by owner.
     *
     * Re-entrancy attack is prevented by `lock` modifier.
     */
    function destroyContract() external onlyOwner lock {
        _settleDonutBoxes();

        selfdestruct(payable(address(this)));
    }
}
