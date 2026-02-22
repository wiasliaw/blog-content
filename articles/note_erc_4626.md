---
created: 2025-01-12
modified: 2025-04-14
title: Note of ERC-4626
description: 簡介 ERC-4626
tags:
  - eip
draft: false
---
[ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) 為何是現在最為泛用的標準之一的理由是 ERC-4626 除了定義非常單純的 interface 還架構了一個通用的會計模型。這個模型可以很好的處理協議盈餘、協議損失，以及設計各種抽取手續費的機制。

## Exchange Rate

ERC-4626 通常以以下數學式計算「用戶存入 assets 後換得的相應 shares」以及「用戶銷毀 shares 後贖回的相應 assets」。這類公式隱含**價格**的意義，所以一些新的 DeFi Protocol 的 Oracle 實作都會接入 ERC4626 作為價格的依據。

$$
\begin{align*}
sharesOut &= assetsIn \times \frac{totalShares}{totalAssets} \\
assetsOut &= sharesIn \times \frac{totalAssets}{totalShares}
\end{align*}
$$

## Dealing with Surplus

假設今天協議賺得收益，可以將盈餘加進 `totalAssets`。如此一來就可以將收益分配給用戶。協議方也可以先從盈餘抽取一部分作為協議收入，再來將盈餘分配下去。

$$
assetsOut = sharesIn \times \frac{totalAssets + surplus}{totalShares}
$$

## Dealing with Losses

這樣的模型也可以處理虧損，由全部的用戶共同承擔。

$$
assetsOut = sharesIn \times \frac{totalAssets - losses}{totalShares}
$$

## Charge Performance Fee

performance fee 通常實作於當利潤是來自於其他的底層協議的 vault。vault owner 從底層協議賺取的利潤中抽出一部分作為 performance fee。這部分有兩種實作方式：

### send to feeRecipient directly

```solidity
uint256 fee = reward.wMulDown(market[id].fee);
IERC20(REWARD_TOKEN).safeTransfer(address(this), feeRecipient, fee);

_erc4626_totalAsset += (reward - fee);
```

第一種方式非常的直覺，直接將 performance fee 轉給 feeRecipient，其餘計入 totalAsset 以給予利息。這樣做有一個缺點，部分流動性會流出沒有辦法完全利用。

### mint additional shares for feeRecipient

另外一種實作則是根據 performance fee 的數量為 feeRecipient 鑄造相應的 shares，以將所有的利潤都計入流動性裡面。實作可以參考 Morpho-blue，雖然不是 ERC4626 但是其 exchange rate 的設計和 ERC4626 雷同。Morpho-blue 有一些不太直覺的最佳化，以下以直觀的方式解釋：

首先 Morpho-blue 的利潤來自於 Borrower 的借貸成本，抽取部分的利潤作為 performance fee：

```solidity
uint256 interest = market[id]
    .totalBorrowAssets
    .wMulDown(borrowRate.wTaylorCompounded(elapsed));

uint256 feeAmount = interest.wMulDown(market[id].fee);
```

接著將利潤分配給 shares holder：

```solidity
// 反應 borrower 的借貸成本
market[id].totalBorrowAssets += interest;

// 分配盈餘給用戶
// totalAssets + interest - feeAmount
market[id].totalSupplyAssets += interest - feeAmount;
```

最後鑄造 shares 給 feeRecipient：

```solidity
// 計算需要鑄造多少 shares
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

以上三段 snippet 最佳化之後就是 [morpho-blue 的實作](https://github.com/morpho-org/morpho-blue/blob/9e2b0755b47bbe5b09bf1be8f00e060d4eab6f1c/src/Morpho.sol#L483-L509)，也可以理解為何原本實作中計算 feeShares 時要在 totalAsset 剪去 feeAmount。

## Charge Entry Fee or Exit Fee

實作進場費 (Entry Fee) 和出場費 (Exit Fee) 時，需要注意 preview 相關函式的計算結果需要將 fee 也考慮進去，觸發的 Event 資訊也需要考量。以下帶過 `previewDeposit` 和 `previewWithdraw` 兩個函式：

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

其餘可以參考 [Openzeppelin 給的範例](https://docs.openzeppelin.com/contracts/4.x/erc4626#fees)
