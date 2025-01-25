---
title: Compound V3 借貸計息實作
description: 
permalink: 
tags:
  - defi/lending
  - protocol/compound_v3
draft: false
created: 2024-12-19, 22:24
updated: 2025-01-02, 11:28
---
Compound V3 是一個老牌的借貸協議，雖然因為 Solidity 的歷史因素使得其 codebase 不是適合 DeFi 開發者學習的典範，但是其借貸核心概念也是值得探討的一環。

## Prerequisite: 股利計息模式

這篇同樣需要回顧[[ctx_分散式金融系統的設計模式|分散式金融系統的設計模式]]。

給定一個系統，系統會記錄一個**快照**並會定期更新。當使用者存入時，會根據這個快照計算出 share，贖回時同樣也會根據快照計算出贖回的數量。公式如下：

$$
shares = \frac{assets}{snapshot}
\\ \ \\
assets = shares \times snapshot
$$

而利息的公式為：

$$
interest = shares \times (snapshot_{withdraw} - snapshot_{deposit})
$$

假定初始 snapshot 為 1，此時 Alice 存入 100 個 assets，可以得到 100 個 shares，表格如下：

|          | Alice |     | \|  | System       |
| -------- | ----- | --- | --- | ------------ |
| deposit  | 100   |     | \|  | snapshot = 1 |
| shares   | 100   |     | \|  |              |
| assets   | 100   |     | \|  |              |
| interest | 0     |     | \|  |              |
| snapshot | 1     |     | \|  |              |

未來系統如果有收益，只要將 snapshot 調高，Alice 如果現在贖回可以贖回 110 個 assets，如此一來就能給到利息：

|          | Alice   |     | \|  | System         |
| -------- | ------- | --- | --- | -------------- |
| deposit  |         |     | \|  | snapshot = 1.1 |
| shares   | 100     |     | \|  |                |
| assets   | **110** |     | \|  |                |
| interest | **10**  |     | \|  |                |
| snapshot | 1       |     | \|  |                |

現在 Bob 存入 110 個 assets，可以得到 100 個 shares ($shares=\frac{110}{1.1}$)：

|          | Alice | Bob     | \|  | System         |
| -------- | ----- | ------- | --- | -------------- |
| deposit  |       | **110** | \|  | snapshot = 1.1 |
| shares   | 100   | **100** | \|  |                |
| assets   | 110   | **110** | \|  |                |
| interest | 10    | 0       | \|  |                |
| snapshot | 1     | 1.1     | \|  |                |

未來系統又有收益，則將 snapshot 提高並發放利息：

|          | Alice | Bob | \|  | System         |
| -------- | ----- | --- | --- | -------------- |
| deposit  |       |     | \|  | snapshot = 1.2 |
| shares   | 100   | 100 | \|  |                |
| assets   | 120   | 120 | \|  |                |
| interest | 20    | 10  | \|  |                |
| snapshot | 1     | 1.1 | \|  |                |

透過例子可以看出，計息模型會將使用者存入和贖回的時間點納入考量，存的比較早的可以領到越多 ($\Delta snaphot$ 越大)。對系統來說，則需要在 shares 有變化時將 snapshot 做更新，但也限制了這個模型不能處理呆帳發生的情況。

## Implementation

Compound V3 以股利計息模式做 accounting，在 codebase 中有三個重要的概念：
- **base index**: 追蹤「從借貸市場開始以來，借出或是供給 1 個資產直到現在的 present value」，以這個值作為 index，對應舉例中的 snapshot
- **principal value**: 這是 Compound V3 中 accounting 的核心，會儲存在 storage 中，對應上面舉例中的 shares
- **present value**: 這是一個隨著 base index 動態更新的值，對應舉例中的 assets。在存入的時候，要存入的資金被視為是 present value，以計算出 principal value 做 accounting

### `principal value`

轉換的公式如下：

$$
PrincipalValue = \frac{PresentValue}{BaseIndex}
$$

實作：
- principal value 也有可能為負值，用以做借貸的 accounting
- `principalValueBorrow` 後面多加的 `baseBorrowIndex_ - 1` 是因為要做 fixed number round up。在系統設計上，round 的方向應朝著「對系統有利的方向做 rounding」。這邊對 borrow 的 principal value 做 round up 會增加其債務。對 supply 則做 round down，這會減少使用者 supply 所拿到的 shares

```solidity
uint64 BASE_INDEX_SCALE = 1e15;

function principalValue(
  int256 presentValue_
) internal view returns (int104) {
  if (presentValue_ >= 0) {
    return signed104(
      principalValueSupply(baseSupplyIndex, uint256(presentValue_))
    );
  } else {
    return -signed104(
      principalValueBorrow(baseBorrowIndex, uint256(-presentValue_))
    );
  }
}

function principalValueSupply(
  uint64 baseSupplyIndex_,
  uint256 presentValue_
) internal pure returns (uint104) {
    return safe104( (presentValue_ * BASE_INDEX_SCALE) / baseSupplyIndex_);
}

function principalValueBorrow(
  uint64 baseBorrowIndex_,
  uint256 presentValue_
) internal pure returns (uint104) {
    return safe104( (presentValue_ * BASE_INDEX_SCALE + baseBorrowIndex_ - 1) / baseBorrowIndex_);
}
```

### `present value`

轉換的公式如下：
$$
PresentValue = PrincipalValue \times BaseIndex
$$

這邊實作就沒有比較特別的地方，也就是將 principal value 倒推回去：

```solidity
uint64 BASE_INDEX_SCALE = 1e15;

function presentValue(
  int104 principalValue_
) internal view returns (int256) {
  if (principalValue_ >= 0) {
    return signed256(presentValueSupply(baseSupplyIndex, uint104(principalValue_)));
  } else {
    return -signed256(presentValueBorrow(baseBorrowIndex, uint104(-principalValue_)));
  }
}

function presentValueSupply(uint64 baseSupplyIndex_, uint104 principalValue_)
  internal pure returns (uint256)
{
  return uint256(principalValue_) * baseSupplyIndex_ / BASE_INDEX_SCALE;
}

function presentValueBorrow(uint64 baseBorrowIndex_, uint104 principalValue_)
  internal pure returns (uint256)
{
  return uint256(principalValue_) * baseBorrowIndex_ / BASE_INDEX_SCALE;
}
```

### `accrueInternal`

主要看 supply base index 和 borrow base index 如何計算出來：

- base index 追蹤「從借貸市場開始以來，借出或是供給 1 個資產直到現在的 present value」
- base index 初始值為 1 (fixed number scaled by 1e15)
- 未來某一個時間點更新 index 時，會先計算 1 個資產賺到利息 ($BaseIndex \times Rate \times TimeElapsed$ )，然後加進 base index 裡面。這裡有複利的效益存在，利息會在下一次更新時被當作本金計算。

```solidity
// constant
uint64 BASE_INDEX_SCALE = 1e15;

// init
baseSupplyIndex = BASE_INDEX_SCALE;
baseBorrowIndex = BASE_INDEX_SCALE;

function accrueInternal() internal {
  uint40 now_ = getNowInternal();
  uint timeElapsed = uint256(now_ - lastAccrualTime);
  if (timeElapsed > 0) {
    // update `baseSupplyIndex` and `baseBorrowIndex`
    (baseSupplyIndex, baseBorrowIndex)
      = accruedInterestIndices(timeElapsed);
    // update timestamp
    lastAccrualTime = now_;
  }
}

function accruedInterestIndices(uint timeElapsed) internal view returns (uint64, uint64) {
  uint64 baseSupplyIndex_ = baseSupplyIndex;
  uint64 baseBorrowIndex_ = baseBorrowIndex;
  if (timeElapsed > 0) {
    uint utilization = getUtilization();
    uint supplyRate = getSupplyRate(utilization);
    uint borrowRate = getBorrowRate(utilization);
    // baseSupplyIndex += (baseSupplyIndex * supplyRate * timeElapsed) / 1e18
    baseSupplyIndex_ += safe64(mulFactor(baseSupplyIndex_, supplyRate * timeElapsed));
    baseBorrowIndex_ += safe64(mulFactor(baseBorrowIndex_, borrowRate * timeElapsed));
  }
  return (baseSupplyIndex_, baseBorrowIndex_);
}
```

## Reference

- https://www.rareskills.io/post/defi-interest-rate-indexes
- https://github.com/compound-finance/comet
