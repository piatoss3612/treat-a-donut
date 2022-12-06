# Ownable



> Ownership of Contract



*Contract module which provides access control only to specific account, owner. This module is used through inheritance.*

## Methods

### owner

```solidity
function owner() external view returns (address)
```

Returns the address of current owner.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | address of current owner |

### transferOwnership

```solidity
function transferOwnership(address _newOwner) external nonpayable
```

Transfers ownership of contract to `_newOwner`. Can only be called by current owner.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _newOwner | address | address of new owner |



## Events

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

Notifies ownership transferral



#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | previous owner |
| newOwner `indexed` | address | new owner |



