---
title: Morpho-Blue 借貸計息實作
description: Morpho 是一個現代化的借貸協議，本文主要簡介 Morpho 核心中有關借貸計息的實作
permalink: 
tags:
  - defi/lending
  - protocol/morpho
draft: false
created: 2024-12-09, 00:06
updated: 2025-03-30, 18:56
---
Morpho 是一個現代化的借貸協議，本文主要簡介 Morpho 核心中有關借貸計息的實作。

## Prerequisite: 股權比例計息

股權比例計息出自於 [Ping Chen](https://x.com/PingChenTW) 的[[ctx_分散式金融系統的設計模式|分散式金融系統的設計模式]]，主要說明在 EVM 的環境下如何計息。

回想一下現在的銀行系統，活存通常會以按月的方式將利息發送到每個人的銀行下。這樣的模式在區塊鏈上是不可行的，每個月需要花費大量的交易和手續費在發送利息，成本十分的可觀。

股權比例計息是將使用者存入的資產以**一定計算公式**轉換成股份，未來使用者可以以**一定計算公式**將股份贖回存入的資產並加上利息即可。

## Prerequisite: Exchange Rate

前面說到資產可以以**一定計算公式**轉換成股份，也可以將股份以**一定計算公式**贖回資產，這兩條公式就是 Exchange Rate。有關 Exchange Rate 的標準在 [ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) 被完整的定義下來，這也是 4626 為何被大量採用的原因之一。

目前大多數的 Exchange Rate 基本公式如下：

$$
shares = assets\ \times\ \frac{totalShares}{totalAssets} \\ \ \\
assets = shares\ \times\ \frac{totalAssets}{totalShares}
$$
- 轉換股份的公式會參照系統裡的總資產 (totalAssets) 和總股份 (totalShares) 的比例計算出即將增發的股份
- 贖回資產的公式也一樣會參照系統裡的總資產 (totalAssets) 和總股份 (totalShares) 的比例計算出即將贖回的資產

## Prerequisite: Example

這邊舉一個假想的例子，給定一個系統中 totalAssets 和 totalShares 各有 10000，Alice 持有 100 個 shares。如果這時候 Alice 選擇贖回 100 個 shares，可以贖回 100 個 assets ($assets =100\times\frac{10000}{10000}$)，以 value 表示當前可贖回的資產數量，表格如下：

|         | Alice |     | \|  | System              |
| ------- | ----- | --- | --- | ------------------- |
| deposit |       |     | \|  | totalAssets = 10000 |
| shares  | 100   |     | \|  | totalShares = 10000 |
| value   | 100   |     | \|  |                     |

現在 Bob 存入 500 個 assets，可以得到 500 個 shares ($share=500\times\frac{10000}{10000}$)，並更新系統裡 totalAssets 和 totalShares 的數量。而 Alice 和 Bob 帳面價值不變：

|         | Alice | Bob     | \|  | System              |
| ------- | ----- | ------- | --- | ------------------- |
| deposit |       | **500** | \|  | totalAssets = 10500 |
| shares  | 100   | **500** | \|  | totalShares = 10500 |
| value   | 100   | **500** | \|  |                     |

如何發放利息，只要為系統注資提高 totalAssets 的數量，如此一來 Alice 和 Bob 可贖回的資產就會增加，進而給到利息，這邊為系統注資 1500：

|         | Alice  | Bob    | \|  | System                  |
| ------- | ------ | ------ | --- | ----------------------- |
| deposit |        |        | \|  | totalAssets = **12000** |
| shares  | 100    | 500    | \|  | totalShares = 10500     |
| value   | 114.28 | 571.42 | \|  |                         |

## Morpho-blue Core

Morpho 身為一個借貸協議，其核心提供「**存入、贖回、借貸、償還債務**」四個功能。

首先來看**存入和贖回資產**的函式，實作上非常的簡潔，就是根據 Exchange Rate 計算將要贖回的資產或是將要增發的股份，不說這是借貸的，真的會讓人以為是 Staking 或是 Vault 的合約程式碼片段：

```solidity
/// @dev src: https://github.com/morpho-org/morpho-blue/blob/a4210e9198bf5e3aa3cde891e035f33dcb31e0de/src/Morpho.sol#L169
function supply(
    MarketParams memory marketParams,
    uint256 assets,
    uint256 shares,
    address onBehalf,
    bytes calldata data
) external returns (uint256, uint256) {
    Id id = marketParams.id();
    // accrue interest
    _accrueInterest(marketParams, id);
    // exchange rate
    if (assets > 0) shares = assets.toSharesDown(market[id].totalSupplyAssets, market[id].totalSupplyShares);
    else assets = shares.toAssetsUp(market[id].totalSupplyAssets, market[id].totalSupplyShares);
    // side effect
    position[id][onBehalf].supplyShares += shares;
    market[id].totalSupplyShares += shares.toUint128();
    market[id].totalSupplyAssets += assets.toUint128();
}

function withdraw(
    MarketParams memory marketParams,
    uint256 assets,
    uint256 shares,
    address onBehalf,
    address receiver
) external returns (uint256, uint256) {
    Id id = marketParams.id();
    // accrue interest
    _accrueInterest(marketParams, id);
    // exchange rate
    if (assets > 0) shares = assets.toSharesUp(market[id].totalSupplyAssets, market[id].totalSupplyShares);
    else assets = shares.toAssetsDown(market[id].totalSupplyAssets, market[id].totalSupplyShares);
    // side effect
    position[id][onBehalf].supplyShares -= shares;
    market[id].totalSupplyShares -= shares.toUint128();
    market[id].totalSupplyAssets -= assets.toUint128();
}
```

再來看**借貸和償還債務**的函式，會發現寫法和前面幾乎差不多，差異是**存入的話記錄的是股份 (supplyShares) 而借出的話是記錄的是借據 (borrowShares)**：

```solidity
/// @dev src: https://github.com/morpho-org/morpho-blue/blob/a4210e9198bf5e3aa3cde891e035f33dcb31e0de/src/Morpho.sol#L235
function borrow(
  MarketParams memory marketParams,
  uint256 assets,
  uint256 shares,
  address onBehalf,
  address receiver
) external returns (uint256, uint256) {
  Id id = marketParams.id();
  // accrue interest
  _accrueInterest(marketParams, id);
  // exchange rate
  if (assets > 0) shares = assets.toSharesUp(market[id].totalBorrowAssets, market[id].totalBorrowShares);
  else assets = shares.toAssetsDown(market[id].totalBorrowAssets, market[id].totalBorrowShares);
  // side effect
  position[id][onBehalf].borrowShares += shares.toUint128();
  market[id].totalBorrowShares += shares.toUint128();
  market[id].totalBorrowAssets += assets.toUint128();
}

function repay(
    MarketParams memory marketParams,
    uint256 assets,
    uint256 shares,
    address onBehalf,
    bytes calldata data
) external returns (uint256, uint256) {
    Id id = marketParams.id();
    // accrue interest
    _accrueInterest(marketParams, id);
    // exchange rate
    if (assets > 0) shares = assets.toSharesDown(market[id].totalBorrowAssets, market[id].totalBorrowShares);
    else assets = shares.toAssetsUp(market[id].totalBorrowAssets, market[id].totalBorrowShares);
    // side effect
    position[id][onBehalf].borrowShares -= shares.toUint128();
    market[id].totalBorrowShares -= shares.toUint128();
    market[id].totalBorrowAssets = UtilsLib.zeroFloorSub(market[id].totalBorrowAssets, assets).toUint128();
}
```

最後來看如何計息。在一個借貸協議中，利息來自於借貸者付的利息。透過程式碼可以看到，Morpho 的借貸計息的模型被拆成兩個 Exchange Rate 處理：
- 在借貸和償還債務的 Exchange Rate 中增加 totalBorrowAssets，就能將借貸行為要付出的成本反映在借貸的債務上
- 在存入和贖回資產的 Exchange Rate 中增加 totalSupplyAssets，就能將利息給到股份上

以下為 Morpho 更新利息的函式：

```solidity
function _accrueInterest(MarketParams memory marketParams, Id id) internal {
    uint256 elapsed = block.timestamp - market[id].lastUpdate;
    if (elapsed == 0) return;

    if (marketParams.irm != address(0)) {
        uint256 borrowRate = IIrm(marketParams.irm).borrowRate(marketParams, market[id]);
        uint256 interest = market[id].totalBorrowAssets.wMulDown(borrowRate.wTaylorCompounded(elapsed));
        market[id].totalBorrowAssets += interest.toUint128();
        market[id].totalSupplyAssets += interest.toUint128();
    }
    market[id].lastUpdate = uint128(block.timestamp);
}
```

另外在 Morpho 存入和借貸的利率就已經是複利了，不需要為了複利去執行其他操作：

```solidity
/// @dev x is rate
/// @dev n is elapsed time
/// @dev compound_rate = (rt) + (rt)^2 / 2e18 + (rt)^3 / 3e18
function wTaylorCompounded(uint256 x, uint256 n) internal pure returns (uint256) {
    uint256 firstTerm = x * n;
    uint256 secondTerm = mulDivDown(firstTerm, firstTerm, 2 * WAD);
    uint256 thirdTerm = mulDivDown(secondTerm, firstTerm, 3 * WAD);

    return firstTerm + secondTerm + thirdTerm;
}
```

## Thought

以上可以看到，Morpho 對借貸計息模型的設計非常的簡潔和獨特，將一個計息模型拆分成兩條 Exchange Rate。

如此一來可以做一些非常有趣但是實務上不推薦也不一定安全的事情，假如有個可以升級的 Staking 合約，那可以為其實作借貸的 Exchange Rate 和 interface，並將透過借貸行爲產生的利息給到 Staking 的 totalSupplyAssets 上。這樣就能將一個 Staking 升級迭代成一個借貸協議。

由於兩條 Exchange Rate 不會互相影響，只透過增加 totalSupplyAssets 和 totalBorrowAssets 來計息，所以兩條 Exchange Rate 可以是兩條不一樣的計算方式。而且 Exchange Rate 也是一種定價的方式，甚至是第一手的價格數據來源，更可以爲 supplyShares 和 borrowShares 做定價。

## Misc & Reference

Morpho 協議已經有人寫過幾篇了，都非常值得一讀

- [Anton](https://x.com/antonttc) 的 [借貸協議 Morpho 簡介](https://medium.com/defi-taiwan/%E5%80%9F%E8%B2%B8%E5%8D%94%E8%AD%B0-morpho-%E7%B0%A1%E4%BB%8B-f8e8f1bbfaa5)
- [WongSSH](https://x.com/wong_ssh) 的 [现代 DeFi:最小化借贷协议 Morpho](https://hackmd.io/@wongssh/morpho)

Reference
- https://github.com/morpho-org/morpho-blue
