# Accounts



> Accounts Management



*Contract module which provides integrated management of user and donut box. This module is used through inheritance.*


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



