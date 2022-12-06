# DonutConnector



> Contract Connector



*Contract module which connects Accounts Contract and Support Contract. This module is used through inheritance.*

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



