---
title: Compound V3 利率模型實作
description: 
permalink: 
tags:
  - defi/lending
  - protocol/compound_v3
draft: false
created: 2024-12-23, 00:58
updated: 2025-01-02, 10:35
---
Compound V3 的利率模型是一個非常簡單的模型，可以以治理的方式更新模型的參數。具體怎麼運作，只需要明白模型的幾個術語和定義就幾乎能完全理解。

## TL;DR

首先 Compound V3 的借貸市場其利率模型同時會有兩個：supply-side 和 borrow-side，提供流動性的有一個利率模型，而借貸行為的有另外一個利率模型。兩個利率模型是一樣的，除了參數有差異之外。如圖：

![[2024_1223_2307.png]]

## Terminology & Formula

### utilization

意義為**資金利用率**，是資產總借出和總供給的一個比率，用以反映出借貸市場的資金使用情況。在 Compound V3 utilization 的計算公式如下：

$$
utilization = \frac{totalBorrow}{totalSupply}
$$

### kink

意義為**最佳資金利用率**。這是一個假定參數，設定經濟效益最好的借貸市場其 utilization 應該為多少。假設 kink 訂定為 90%，那這個借貸市場經濟效益最好的時候是將供給的資金借出 90%，另外 10% 用於儲備。在借貸市場中，不會將所有供給的資金全部借出，會有一部分用作準備金用以做贖回。在利用率高於 kink 的時候，利率會急劇攀升以刺激借款方還款。

### interest rate

利率為 utilization 的函數，公式如下：

$$

rate(utilization) =  \begin{cases}
base + utilization \times slopeLow，\text{if } utilization \le kink \\
base + utilization \times kink + (kink - utilization) \times slopeHigh，\text{if } utilization \gt kink \\
\end{cases}
$$

利用率低於 kink 的時候有一個定義了一個斜率，而利用率高於 kink 的時候會採用另外一個斜率，讓利率急劇上升。

base 可能為 0。base 不為零則表示當沒有人借款的時候，系統需要支付供給者利息，而借貸市場獲益的方式就是放款出去從借貸者賺取利息。在無人借款的情況下，系統自然沒有收益去承擔供給者利息。

## Implementation

先看 storage 的部分，supply-side 和 borrow-side 所有的參數都是 scaled by 1e18 的 fixed number：

```solidity
/// @@dev https://github.com/compound-finance/comet/blob/51c2ad5e02a74b6a824cf3f864ffbb7ec498d6c8/contracts/Comet.sol#L13
uint64 public immutable supplyKink;
uint64 public immutable supplyPerSecondInterestRateSlopeLow;
uint64 public immutable supplyPerSecondInterestRateSlopeHigh;
uint64 public immutable supplyPerSecondInterestRateBase;

uint64 public immutable borrowKink;
uint64 public immutable borrowPerSecondInterestRateSlopeLow;
uint64 public immutable borrowPerSecondInterestRateSlopeHigh;
uint64 public immutable borrowPerSecondInterestRateBase;
```

計算 utilization 的實作如下，`totalSupply_` 和 `totalBorrow_` 兩個變數意義分別為「總供給資產數量加上利息」和「總借出資產數量加上利息」，可以參考 [[compound_v3_lending_core_impl#Implementation|Compound V3 借貸計息實作]]:

```solidity
uint64 internal constant FACTOR_SCALE = 1e18;

function getUtilization() override public view returns (uint) {
    // meaning that `totalSupplyBase + interest`
    uint totalSupply_ = presentValueSupply(baseSupplyIndex, totalSupplyBase);
    // meaning that `totalSupplyBase + interest`
    uint totalBorrow_ = presentValueBorrow(baseBorrowIndex, totalBorrowBase);
    if (totalSupply_ == 0) {
        return 0;
    } else {
        return totalBorrow_ * FACTOR_SCALE / totalSupply_;
    }
}
```

計算「供給利率」和「借貸利率」：

```solidity
/// @dev multiplication for fixed number scaled by 1e18
function mulFactor(uint n, uint factor) internal pure returns (uint) {
    return n * factor / FACTOR_SCALE;
}

function getSupplyRate(uint utilization) override public view returns (uint64) {
    if (utilization <= supplyKink) {
        // interestRateBase + interestRateSlopeLow * utilization
        return safe64(supplyPerSecondInterestRateBase + mulFactor(supplyPerSecondInterestRateSlopeLow, utilization));
    } else {
        // interestRateBase + interestRateSlopeLow * kink + interestRateSlopeHigh * (utilization - kink)
        return safe64(supplyPerSecondInterestRateBase + mulFactor(supplyPerSecondInterestRateSlopeLow, supplyKink) + mulFactor(supplyPerSecondInterestRateSlopeHigh, (utilization - supplyKink)));
    }
}

function getBorrowRate(uint utilization) override public view returns (uint64) {
    if (utilization <= borrowKink) {
        // interestRateBase + interestRateSlopeLow * utilization
        return safe64(borrowPerSecondInterestRateBase + mulFactor(borrowPerSecondInterestRateSlopeLow, utilization));
    } else {
        // interestRateBase + interestRateSlopeLow * kink + interestRateSlopeHigh * (utilization - kink)
        return safe64(borrowPerSecondInterestRateBase + mulFactor(borrowPerSecondInterestRateSlopeLow, borrowKink) + mulFactor(borrowPerSecondInterestRateSlopeHigh, (utilization - borrowKink)));
    }
}
```

## 實際理解利率參數

首先需要知道資料的單位和型別：
- `kink`, `slope low`, `slope high`, `base rate`，四個都是 scaled by 1e18 的 fixed number
- Compound V3 以 per second 為時間單位計算利息，所以利率模型的參數都是以 per second 為時間單位的利率

這裡以一個 [USDC 借貸市場](https://app.compound.finance/markets/usdc-mainnet)實際試算，首先先取得特定區塊 supply-side 的資料：

```bash
cast call 0xc3d688B66703497DAA19211EEdff47f25384cdc3 "totalSupply()(uint256)" --block 21466495 --rpc-url mainnet
# totalSupply 476852844078057 [4.768e14]

cast call 0xc3d688B66703497DAA19211EEdff47f25384cdc3 "totalBorrow()(uint256)" --block 21466495 --rpc-url mainnet
# totalBorrow 435600946895498 [4.356e14]

cast call 0xc3d688B66703497DAA19211EEdff47f25384cdc3 "supplyKink()(uint256)" --block 21466495 --rpc-url mainnet
# supplyKink 900000000000000000 [9e17]

cast call 0xc3d688B66703497DAA19211EEdff47f25384cdc3 "supplyPerSecondInterestRateSlopeLow()(uint256)" --block 21466495 --rpc-url mainnet
# supplyPerSecondInterestRateSlopeLow 1712328767 [1.712e9]

cast call 0xc3d688B66703497DAA19211EEdff47f25384cdc3 "supplyPerSecondInterestRateSlopeHigh()(uint256)" --block 21466495 --rpc-url mainnet
# supplyPerSecondInterestRateSlopeHigh 96207508878 [9.62e10]

cast call 0xc3d688B66703497DAA19211EEdff47f25384cdc3 "supplyPerSecondInterestRateBase()(uint256)" --block 21466495 --rpc-url mainnet
# supplyPerSecondInterestRateBase 0
```

計算 utilization 並和鏈上資料比對：

```bash
chisel

➜ uint256 totalSupply = 435600946895498;
➜ uint256 totalBorrow = 476852844078057;
➜ (totalSupply * 1e18) / totalBorrow;
Type: uint256
├ Hex: 0xcad5f8a500f3d6d
├ Hex (full word): 0xcad5f8a500f3d6d
└ Decimal: 913491347079380333

# utilization = 913491347079380333 [9.134e17] = 91.34%
```

```bash
# fetch utilization on-chain
cast call 0xc3d688B66703497DAA19211EEdff47f25384cdc3 "getUtilization()(uint256)" --block 21466495 --rpc-url mainnet
# 913491347079380333 [9.134e17]
```

計算 supply interest rate 並和鏈上資料比對 (borrow interest rate 計算方式也相同)：

```bash
chisel

➜ uint256 baseRate = 0;
➜ uint256 slopeLow = 1712328767;
➜ uint256 slopeHigh = 96207508878;
➜ uint256 kink = 900000000000000000;
➜ uint256 curr_utils = 913491347079380333;
➜ baseRate + (slopeLow * kink / 1e18) + (slopeHigh * (curr_utils - kink) / 1e18)
Type: uint256
├ Hex: 0xa938b0cf
├ Hex (full word): 0xa938b0cf
└ Decimal: 2839064783

# supply_rate = 2839064783
```

```bash
# fetch supply rate on-chain
cast call 0xc3d688B66703497DAA19211EEdff47f25384cdc3 "getSupplyRate(uint256)(uint256)" 913491347079380333  --block 21466495 --rpc-url mainnet
# 2839064783 [2.839e9]
```

先前提到過，Compound V3 是以 per second 為時間單位計算利息，將 `supply_rate` 乘以 `365 * 24 * 60 * 60` 就可以得到 Annual Percentage Rate，也就是 compound V3 UI 上所呈現的利率。最後試算可得，在利用率 91.34% 的利用率下，其 supply interest rate APR 大約為 8.9%。

```bash
2839064783 * 365 * 24 * 60 * 60 / 1e18 = 8.9532747%
```

## Reference

- https://github.com/compound-finance/comet
- https://www.rareskills.io/post/compound-finance-interest-rate-model
