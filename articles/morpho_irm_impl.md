---
title: Morpho-Blue 利率模型實作
description: Morpho 是一個現代化的借貸協議，本文主要簡介 Morpho 核心中有關 Interest Rate Model 實作
permalink: 
tags:
  - defi/lending
  - protocol/morpho
draft: false
created: 2025-01-21, 16:14
updated: 2025-03-30, 18:59
---
本文主要在解釋 Morpho Interest Rate Model 實作，不做數學推導。

## Adaptive

Morpho Interest Rate Model 旨在設計一條可以根據市場狀況自行調整的利率曲線，以將市場利用率維持在 90%。如果當前市場的資金利用率大於「目標資金利用率」，利率曲線會整個向上移動，如果小於「目標資金利用率」，則利率曲線會整個向下移動。

以下為官方文件的動態圖：

![](https://docs.morpho.org/img/morpho-blue/adaptive-curve-irm.mp4)

## How it works

### target utilization

目標資金利用率，為 90% 的 constant variable：

```solidity
/// @dev https://github.com/morpho-org/morpho-blue-irm/blob/0e99e647c9bd6d3207f450144b6053cf807fa8c4/src/adaptive-curve-irm/libraries/ConstantsLib.sol#L18-L20

/// @notice Target utilization (scaled by WAD).
/// @dev Target utilization = 90%.
int256 public constant TARGET_UTILIZATION = 0.9 ether;
```

### utilization

當前市場的資金利用率，為總供給和總借出的比率：

$$
utilization = \frac{totalBorrowAssets}{totalSupplyAssets}
$$

```solidity
/// @dev https://github.com/morpho-org/morpho-blue-irm/blob/0e99e647c9bd6d3207f450144b6053cf807fa8c4/src/adaptive-curve-irm/AdaptiveCurveIrm.sol#L78-L79C116
int256 utilization = int256(
  market.totalSupplyAssets > 0
    ? market.totalBorrowAssets.wDivDown(market.totalSupplyAssets)
    : 0
);
```

### Err Factor

這裡不是錯誤的意思，而是將「當前利用率和目標利用率的差值做正規化」，也就是實際的差轉換成一個比率，其 range 在 `[-1, 1]` 之間：

$$
e(u) = \Bigg\{ \begin{matrix}
\frac{u(t)-u_{target}}{1-u_{target}} ,\text{if } u(t) \gt u_{target} \\
\ \\
\frac{u(t)-u_{target}}{u_{target}},\text{if } u(t) \le u_{target}
\end{matrix}
$$

舉個例子：

```txt
e(0%) = -1
e(45%) = (0.45 - 0.9) / (0.9) = -0.5
e(95%) = (0.95 - 0.9) / (1 - 0.9) = 0.5
e(100%) = 1
```

```solidity
/// @dev https://github.com/morpho-org/morpho-blue-irm/blob/0e99e647c9bd6d3207f450144b6053cf807fa8c4/src/adaptive-curve-irm/AdaptiveCurveIrm.sol#L81-L84

// Denominator
int256 errNormFactor = utilization > ConstantsLib.TARGET_UTILIZATION
  ? WAD - ConstantsLib.TARGET_UTILIZATION
  : ConstantsLib.TARGET_UTILIZATION;
// Numerator / Denominator
int256 err = (utilization - ConstantsLib.TARGET_UTILIZATION)
  .wDivToZero(errNormFactor);
```

### Linear Adaptation

字面意義為調整量，根據 Err Factor 與經過的時間來決定需要調整多少：

$$
\begin{align*}
speed &= adjustmentSpeed \times e(u) \\
adaptation &= speed \times elapsedTime
\end{align*}
$$

```solidity
/// @dev https://github.com/morpho-org/morpho-blue-irm/blob/0e99e647c9bd6d3207f450144b6053cf807fa8c4/src/adaptive-curve-irm/libraries/ConstantsLib.sol#L15-L16

int256 constant ADJUSTMENT_SPEED = 50 ether / int256(365 days);

/// @dev https://github.com/morpho-org/morpho-blue-irm/blob/0e99e647c9bd6d3207f450144b6053cf807fa8c4/src/adaptive-curve-irm/AdaptiveCurveIrm.sol#L96-L102

int256 speed = ConstantsLib.ADJUSTMENT_SPEED.wMulToZero(err);
int256 elapsed = int256(block.timestamp - market.lastUpdate);
int256 linearAdaptation = speed * elapsed;
```

### new rate calculation

前面已經計算了「與目標利率差距多少 (Err Factor)」和「調整量 (Linear Adaptation)」，根據這兩者在新的利率時，將整個利率曲線往上或是往下調整。計算利率計算公式如下：

$$
newRate = rate \times e^{linearAdaptation}
$$

實作中，`bound` 限制了最大最小值：

```solidity
https://github.com/morpho-org/morpho-blue-irm/blob/0e99e647c9bd6d3207f450144b6053cf807fa8c4/src/adaptive-curve-irm/AdaptiveCurveIrm.sol#L143-L150

/// @dev Minimum rate at target = 0.1% (minimum rate = 0.025%).
int256 public constant MIN_RATE_AT_TARGET = 0.001 ether / int256(365 days);

/// @dev Maximum rate at target = 200% (maximum rate = 800%).
int256 public constant MAX_RATE_AT_TARGET = 2.0 ether / int256(365 days);

function _newRateAtTarget(
  int256 startRateAtTarget,
  int256 linearAdaptation
) private pure returns (int256) {
  return startRateAtTarget
    .wMulToZero(ExpLib.wExp(linearAdaptation))
    .bound(ConstantsLib.MIN_RATE_AT_TARGET, ConstantsLib.MAX_RATE_AT_TARGET);
}
```

看一下 $y = e^x$ 的座標圖，其 range 為 `(0, infinity)`，將新的利率乘以 `e^x` 作用相當於放大或是縮小利率。當利用率小於目標利用率，Err Factor 和 Linear Adaptation 都會是負值，進而將利率縮小；反之則放大：

![[2025_0121_1820.png]]

### curve

Morpho IRM 實作的利率曲線也有和 Compound V3 一樣有「在利用率大於目標利用率時會使利率急遽上升」的機制。Morpho IRM 的 Curve 將利率取出來分開計算，計算的最終結果是一個比率，用來乘上之前計算出的利率。此外不是使用利用率而是以 Err Factor 作為 x 值。

Curve 的公式如下：

$$
curve(u) = \Bigg\{ \begin{matrix}
(k_d-1) \times e(u) + 1,\ \text{if } u(t) \gt u_{target} \\
\ \\
(1-\frac{1}{k_d}) \times e(u) + 1,\ \text{if } u(t) \le u_{target}
\end{matrix}
$$

```solidity
/// @dev https://github.com/morpho-org/morpho-blue-irm/blob/0e99e647c9bd6d3207f450144b6053cf807fa8c4/src/adaptive-curve-irm/AdaptiveCurveIrm.sol#L136-L141
function _curve(
  int256 _rateAtTarget,
  int256 err
) private pure returns (int256) {
  int256 coeff = err < 0
    ? WAD - WAD.wDivToZero(ConstantsLib.CURVE_STEEPNESS)
    : ConstantsLib.CURVE_STEEPNESS - WAD;

  return (coeff.wMulToZero(err) + WAD)
    .wMulToZero(int256(_rateAtTarget));
}
```

## Conclusion

Morpho IRM 旨在以借貸市場的情況自動調整利率曲線，進而不需要治理以更新參數。在 Morpho-blue 建立一個借貸市場時，會在 IRM 以一個固定的利率初始化市場，之後利率更新則根據 Err Factor 和 Linear Adaptation 計算，最後乘以 curve 計算的比率回傳給 Morpho-blue。

## Reference

- https://docs.morpho.org/morpho/concepts/irm
- https://docs.morpho.org/morpho/concepts/irm
- https://docs.morpho.org/morpho/contracts/irm/adaptive-curve-irm
- https://github.com/morpho-org/morpho-blue-irm
- https://hackmd.io/@wongssh/morpho 推薦閱讀數學相關的推導
- [[compound_v3_irm_impl]]
- [[morpho_lending_core_impl]]
