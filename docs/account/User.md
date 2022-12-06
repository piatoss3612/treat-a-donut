# User



> User Management



*Contract module which provides access control to specific accounts registered as user This module is used through inheritance.*


## Events

### UserRegistered

```solidity
event UserRegistered(address user, bool success, uint256 timestamp)
```

Notifies user registration



#### Parameters

| Name | Type | Description |
|---|---|---|
| user  | address | registered user |
| success  | bool | whether registration success or not |
| timestamp  | uint256 | timestamp of transaction |

### UserUnregistered

```solidity
event UserUnregistered(address user, bool success, uint256 timestamp)
```

Notifies user unregistration



#### Parameters

| Name | Type | Description |
|---|---|---|
| user  | address | unregistered user |
| success  | bool | whether unregistration success or not |
| timestamp  | uint256 | timestamp of transaction |



