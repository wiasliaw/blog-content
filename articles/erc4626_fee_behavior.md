---
title: ERC4626 如何抽 Fee
description: 
permalink: 
tags:
  - eip
draft: false
created: 2025-03-11, 23:47
updated: 2025-03-17, 21:40
---
簡介 ERC4626 收取 fee 相關的實作，不同的資金來源會有不同相應的實作。

## performance fee

performance fee 通常實作於當利潤是來自於其他的底層協議的 vault。vault owner 從底層協議賺取的利潤中抽出一部分作為 performance fee。這部分有兩種實作方式：

### send to feeRecipient directly

```solidity
uint256 fee = reward.wMulDown(market[id].fee);
IERC20(REWARD_TOKEN).safeTransfer(address(this), feeRecipient, fee);

_erc4626_totalAsset += (reward - fee);
```

第一種方式非常的直覺，直接將 performance fee 轉給 feeRecipient，其餘計入 totalAsset 以給予利息。這樣做有一個缺點，流動性會流出沒有辦法完全利用。

### mint additional shares for feeRecipient

另外一種實作則是根據 performance fee 的數量為 feeRecipient 鑄造相應的 shares，以將所有的利潤都計入流動性裡面。實作可以參考 Morpho-blue，雖然不是 ERC4626 但是其 exchange rate 的設計和 ERC4626 雷同。Morpho-blue 有一些不太直覺的最佳化，以下以直觀的方式解釋：

首先 Morpho-blue 的利潤來自於 borrower 的借貸成本，抽取部分的利潤作為 performance fee：

```solidity
uint256 interest = market[id].totalBorrowAssets.wMulDown(borrowRate.wTaylorCompounded(elapsed));

uint256 feeAmount = interest.wMulDown(market[id].fee);
```

接著將利潤分配給 shares holder：

```solidity
// 反應 borrower 的借貸成本
market[id].totalBorrowAssets += interest;
// 反應 supplier 的利潤
// totalAssets + interest - feeAmount
market[id].totalSupplyAssets += interest - feeAmount;
```

最後鑄造 shares 給 feeRecipient：

```solidity
feeShares = feeAmount.toSharesDown(
  // totalAssets + interest - feeAmount
  market[id].totalSupplyAssets,
  // totalShares
  market[id].totalSupplyShares
);

// mint shares to feeRecipient
position[id][feeRecipient].supplyShares += feeShares;
// totalAssets + interest - feeAmount + feeAmount = totalAssets + interest
market[id].totalSupplyAssets += feeAmount.toUint128();
// totalShares + feeShares
market[id].totalSupplyShares += feeShares.toUint128();
```

以上三段 snippet 最佳化之後就是 morpho-blue 的實作，也可以理解為何原本實作中計算 feeShares 時要在 totalAsset 剪去 feeAmount。

## entry fee and exit fee

在 ERC4626 中實作進場費和出場費時，需要注意 preview 相關函式的計算結果需要將 fee 也考慮進去，觸發的 Event 資訊也需要考量。以下帶過 `previewDeposit` 和 `previewWithdraw` 兩個函式：

`previewDeposit` 的 assets 意義為「具體要存入多少 underlying asset」，這個值意義上包含 fee，所以將 entry fee 計算出來後從 assets 扣除：

```solidity
function previewDeposit(uint256 assets) public view virtual override returns (uint256) {
    uint256 fee = _feeOnTotal(assets, _entryFeeBasisPoints());
    return super.previewDeposit(assets - fee);
}
```

`previewWithdraw` 的 assets 意義為「具體要取出多少 underlying asset」，這個值意義上不含 fee，所以將 exit fee 計算出來後從 assets 加上：

```solidity
function previewWithdraw(uint256 assets) public view virtual override returns (uint256) {
    uint256 fee = _feeOnRaw(assets, _exitFeeBasisPoints());
    return super.previewWithdraw(assets + fee);
}
```

其餘可以參考 Openzeppelin 給的範例。

## Reference

- https://github.com/morpho-org/morpho-blue/blob/9e2b0755b47bbe5b09bf1be8f00e060d4eab6f1c/src/Morpho.sol#L483-L509
- https://docs.openzeppelin.com/contracts/4.x/erc4626#fees
