# Support



> Donut Support Management



*Contract module which provides calculations for donut support and stores support receipts. This module is used through inheritance.*

## Methods

### DONUT

```solidity
function DONUT() external view returns (uint256)
```

fixed price of each donut




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | price of donut |



## Events

### DonutSupported

```solidity
event DonutSupported(address indexed from, address indexed to, uint256 donuts, string message, uint256 timestamp)
```

Notifies donuts have been supported



#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | address of supporter |
| to `indexed` | address | address of beneficiary |
| donuts  | uint256 | the number of donuts supported |
| message  | string | message enveloped |
| timestamp  | uint256 | timestamp of transaction |



