# TreatADonut

*piatoss3612*

> Treat A Donut Contract



*Contract module which provides simple donation functionality.*

## Methods

### DONUT

```solidity
function DONUT() external view returns (uint256)
```

fixed price of each donut




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### activateBox

```solidity
function activateBox() external nonpayable
```

Activates box of sender. Only registered user can trigger this function.




### boxOf

```solidity
function boxOf(address _user) external view returns (struct DonutBox.Box)
```

Returns donut box of `_user`



#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | address of user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | DonutBox.Box | box of `_user` |

### deactivateBox

```solidity
function deactivateBox() external nonpayable
```

Deactivates box of sender. Only registered user can trigger this function.




### destroyContract

```solidity
function destroyContract() external nonpayable
```

Settles balance of all accounts and destroies contract. Only can triggered by owner. Re-entrancy attack is prevented by `lock` modifier.




### getReceiptsOfBeneficiary

```solidity
function getReceiptsOfBeneficiary(address _beneficiary) external view returns (struct Support.SupportReceipt[])
```

Returns receipts of `_beneficiary` stored on chain



#### Parameters

| Name | Type | Description |
|---|---|---|
| _beneficiary | address | address of beneficiary |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | Support.SupportReceipt[] | receipts of `_beneficiary` |

### getReceiptsOfSupporter

```solidity
function getReceiptsOfSupporter(address _supporter) external view returns (struct Support.SupportReceipt[])
```

Returns receipts of `_supporter` stored on chain



#### Parameters

| Name | Type | Description |
|---|---|---|
| _supporter | address | address of supporter |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | Support.SupportReceipt[] | receipts of `_supporter` |

### getUsers

```solidity
function getUsers() external view returns (address[])
```

Returns addresses of registered users




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address[] | addresses of registered users |

### isUser

```solidity
function isUser(address _addr) external view returns (bool)
```

Verifies whether `_addr` is registered user or not



#### Parameters

| Name | Type | Description |
|---|---|---|
| _addr | address | address to verify |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | true if `_addr` is user else false |

### owner

```solidity
function owner() external view returns (address)
```

Returns the address of current owner.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | address of current owner |

### register

```solidity
function register() external nonpayable
```

Registers sender as user, and activates box of sender. Already registered user cannot trigger this function.




### supportDonut

```solidity
function supportDonut(address _to, uint256 _donuts, string _message) external payable
```

Supports donuts to `_to` expect base fee and store receipt of transaction on chain. The number of donuts should not be below zero, and reciever should not be yourself. Receiver should be a valid user with activated box. Value should be greater than or equal to total payment in need.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _to | address | address of receiver |
| _donuts | uint256 | the number of donuts supported |
| _message | string | message enveloped from sender |

### transferOwnership

```solidity
function transferOwnership(address _newOwner) external nonpayable
```

Transfers ownership of contract to `_newOwner`. Can only be called by current owner.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _newOwner | address | address of new owner |

### unregister

```solidity
function unregister() external nonpayable
```

Unregisters sender, and deactivates box of sender. Only registered user can trigger this function.




### withdraw

```solidity
function withdraw(uint256 _amount) external nonpayable
```

Withdraws balance from the box of sender. Only register user can trigger the function and re-entrancy attack is prohibited by `lock` modifier. The amount to withdraw should be greater than zero. The box of sender should be activated and have enough balance.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | uint256 | amount to withdraw from balance |



## Events

### DonutBoxActivated

```solidity
event DonutBoxActivated(address indexed user, uint256 timestamp)
```

Notifies donut box activation



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | undefined |
| timestamp  | uint256 | undefined |

### DonutBoxDeactivated

```solidity
event DonutBoxDeactivated(address indexed user, uint256 timestamp)
```

Notifies donut box deactivation



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | undefined |
| timestamp  | uint256 | undefined |

### DonutSupported

```solidity
event DonutSupported(address indexed from, address indexed to, uint256 donuts, string message, uint256 timestamp)
```

Notifies donuts have been supported



#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| donuts  | uint256 | undefined |
| message  | string | undefined |
| timestamp  | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

Notifies ownership transferral



#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### UserRegistered

```solidity
event UserRegistered(address user, bool success, uint256 timestamp)
```

Notifies user registration



#### Parameters

| Name | Type | Description |
|---|---|---|
| user  | address | undefined |
| success  | bool | undefined |
| timestamp  | uint256 | undefined |

### UserUnregistered

```solidity
event UserUnregistered(address user, bool success, uint256 timestamp)
```

Notifies user unregistration



#### Parameters

| Name | Type | Description |
|---|---|---|
| user  | address | undefined |
| success  | bool | undefined |
| timestamp  | uint256 | undefined |

### Withdrawn

```solidity
event Withdrawn(address indexed user, uint256 amount, uint256 timestamp)
```

Notifies balance withdrawal



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | undefined |
| amount  | uint256 | undefined |
| timestamp  | uint256 | undefined |



## Errors

### BalanceDepositOverflow

```solidity
error BalanceDepositOverflow()
```






### BalanceWithdrawOverflow

```solidity
error BalanceWithdrawOverflow()
```






### BaseFeeCalculationToZero

```solidity
error BaseFeeCalculationToZero()
```






### BaseFeeExceptionOverflow

```solidity
error BaseFeeExceptionOverflow()
```






### TotalPaymentCalculationOverflow

```solidity
error TotalPaymentCalculationOverflow()
```






### UserIndexToAddressNotMatched

```solidity
error UserIndexToAddressNotMatched()
```







