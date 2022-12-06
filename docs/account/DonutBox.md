# DonutBox



> DonutBox Management



*Contract module which provides box that can save balance and change state Can use this contract to implement pull over push pattern. This module is used through inheritance.*


## Events

### DonutBoxActivated

```solidity
event DonutBoxActivated(address indexed user, uint256 timestamp)
```

Notifies donut box activation



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | user requested donut box activation |
| timestamp  | uint256 | timestamp of transaction |

### DonutBoxDeactivated

```solidity
event DonutBoxDeactivated(address indexed user, uint256 timestamp)
```

Notifies donut box deactivation



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | user requested donut box deactivation |
| timestamp  | uint256 | timestamp of transaction |

### Withdrawn

```solidity
event Withdrawn(address indexed user, uint256 amount, uint256 timestamp)
```

Notifies balance withdrawal



#### Parameters

| Name | Type | Description |
|---|---|---|
| user `indexed` | address | user requested balance withdrawal |
| amount  | uint256 | balance withdrawn |
| timestamp  | uint256 | timestamp of transaction |



