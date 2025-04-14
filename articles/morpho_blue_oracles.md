---
title: Morpho-Blue 預言機實作
description: 本文主要簡介 Morpho 核心中有關 Oracles 的實作
permalink: 
tags:
  - defi/oracle
  - protocol/morpho
draft: false
created: 2025-01-12, 01:16
updated: 2025-04-14, 15:27
---
本文主旨在拆解 morpho-blue 的預言機實作，支援 ERC4626 share token 的報價並整合 chainlink oracle，實作只有一個 constructor 和一個 view function，看似簡單但是其有些複雜的地方。

## `price()`

首先來看 price 的實作，程式碼如下：

```solidity
function price() external view returns (uint256) {
  return SCALE_FACTOR.mulDiv(
    BASE_VAULT.getAssets(BASE_VAULT_CONVERSION_SAMPLE)
      * BASE_FEED_1.getPrice()
      * BASE_FEED_2.getPrice(),
    QUOTE_VAULT.getAssets(QUOTE_VAULT_CONVERSION_SAMPLE)
      * QUOTE_FEED_1.getPrice()
      * QUOTE_FEED_2.getPrice()
  );
}
```

可以從中知道 price() 回傳的就只是一個價格，可以簡化成：

$$
price = scaleFactor \times \frac{
  baseERC4626.pricePerShare \times baseFeed_1 \times baseFeed_2
}{
  quoteERC4626.pricePerShare \times quoteFeed_1 \times quoteFeed_2
}
$$

透過 `ERC4626.convertToAssets()` 支援 shares 的定價，再來以 chainlink oracle 做進一步轉換。

舉例來說，給定有一個接受 native ETH 的 ERC4626 vault，可以以上的方式為其 shares 以美金做定價：

```txt
price_share/usd = ERC4626.convertToAssets(amount)
  * chainlink_eth/usdc_oracle
  * chainlink_usdc/usd_oracle
```

更近一步，如果要建立 `erc4626_wbtc / erc4626_weth` 的預言機，可以以下的設定架構出來：

```txt
// erc4626_wbtc_share -> wbtc -> usdt -> usd
price_wbtc_share/usd = wbtc_vault.convertToAssets(amount)
  * chainlink_wbtc/usdt_oracle
  * chainlink_usdt/usd_oracle;

// erc4626_weth_share -> weth -> usdc -> usd
price_weth_share/usd = weth_vault.convertToAssets(amount)
  * chainlink_weth/usdc_oracle
  * chainlink_usdc/usd_oracle;

return = (price_wbtc/usd) / (price_weth/usd)
```

## `SCALE_FACTOR`

`SCALE_FACTOR` 主要在處理 feed decimals、不同 token decimal 和 chainlink feed decimal 之間的轉換，拆成三個部分來理解 scale factor 是怎麼定義出來的：

### chainlink feed decimals

chainlink oracle 會揭露出 feed decimals，直接取得即可 

```solidity
interface AggregatorV3Interface {
  function decimals() external view returns (uint8);
}
```

前面知道 `price()` 是以兩個 erc4626 和四個 chainlink oracle 的 price 計算得出，這邊將計算簡化成只有兩個 chainlink oracle。如果要架構一個 `WBTC/WETH` 的預言機，可以以 `WBTC/USDT` 和 `WETH/USDT` 兩個 chainlink oracle 組出來，將其相除即可得 `WBTC/WETH` 的預言機：

$$
\frac{WBTC}{WETH} = \frac{WBTC / USDT}{WETH / USDT}
$$

假定這個 `WBTC/WETH` 預言機的 feed decimal 為 18，`WBTC/USDT` oracle feed decimals 為 13，`WETH/USDT` oracle feed decimals 為 7。如果直接相除，最終會得到 decimals 為 6 的價格：

```txt
price_wbtc_usdt = p_1                 // scaled by 1e13
price_weth_usdt = p_2                 // scaled by 1e7

price_wbtc_weth
  = price_wbtc_usdt / price_weth_usdt
  = p_1 / p_2                         // scaled by 1e6 (13 - 7)
```

大部分預言機實作會額外乘以一個 scale factor，將 feed decimal 滿足，這個範例 scale factor 的 decimal 應該為 12：

```txt
price_wbtc_weth
  = scale * p_1 / p_2
  = return_value         // scaled by 1e18 (scale_decimal + 13 - 7)

scale = 18 - 13 + 7 = 12
```

從以上可以歸納出，**定義 scale 的公式**如下：

$$
scaleDecimal = feedDecimal - baseFeedDecimal + quoteFeedDecimal
$$

### ERC4626 price per shares

前面 `price()` 的定義中，需要的是 ERC4626 的 share 的「價格」而不是「數量」，所以 morpho 的實作中額外定義了兩個變數 `BASE_VAULT_CONVERSION_SAMPLE` 和 `BASE_VAULT_CONVERSION_SAMPLE`，**以固定的數量的 share 轉換並除以固定的數量的 underlying asset amount**，為 share 定價：

```solidity
// pseudocode
uint256 sample = 1000;

function pricePerShare() external view returns (uint256) {
  return baseVault.convertToAsset(sample) / sample;
}
```

推廣成兩個 ERC4626 vault 並設計回傳 base/quote 的 price 函式 ，範例如下：

```solidity
// pseudocode
uint256 baseSample = 1000;
uint256 quoteSample = 1;

// price of BASE/QUOTE
// Assume that baseVault and quoteVault have the same underlying asset.
function price() external view returns (uint256) {
  // uint256 basePrice = baseVault.convertToAssets(baseSample) / baseSample;
  // uint256 quotePrice = quoteVault.convertToAssets(quoteSample) / quoteSample;
  // return basePrice / quotePrice;
  return baseVault.convertToAssets(baseSample)
    / baseSample
    / quoteVault.convertToAssets(quoteSample)
    * quoteSample;
}
```

morpho 的實作中將需要「多乘的 quoteSample」和「多除的 baseSample」拆出來反映在 scale factor，**定義 scale factor 的公式**如下：

$$
scaleFactor \times \frac{quoteSample}{baseSample}
$$
### token decimals

`convertToAssets(shares)` 會將 share 的數量轉換成 underlying asset 的數量並回傳。回傳的是「數量」不是「價格」，只需要考量 underlying token 的 token decimals，不需要考量 share token 的 decimals。

不同的代幣可能有不同的 token decimals 需要考量，同樣需要額外乘以一個 scale 來處理，假設 `base/quote` 的 decimals 為 18， base underlying asset 的 decimal 為 11，quote underlying asset 的 decimal 為 7，則 scale decimal 應為 14：

```txt
price_base_quote(1e18) = scale(?) * baseVault_underlyingAmount(1e11) / quoteVault_underlyingAmount (1e7)

scaleDecimal = 18 - 11 + 7 = 14
```

從以上可以歸納出，**定義 scale 的公式**如下：

$$
scaleDecimal = feedDecimal - baseTokenDecimal + quoteTokenDecimal
$$

### Final

整合以上三個定義 scale 的公式，可以得到：

$$
\begin{align}
scaleDecimal &= feedDecimal \\
             &- baseTokenDecimal + quoteTokenDecimal \\
             &- baseFeedDecimal + quoteFeedDecimal
\\ \ \\
scaleFactor &\times \frac{quoteSample}{baseSample}
\end{align}
$$

`SCALE_FACTOR` 在 constructor 中計算，可以知道 morpho oracle 是一個 feed decimals 為 36 的預言機：

```solidity
uint256 SCALE_FACTOR = 10 ** (
  36 + quoteTokenDecimals + quoteFeed1.getDecimals() + quoteFeed2.getDecimals()
     - baseTokenDecimals  - baseFeed1.getDecimals()  - baseFeed2.getDecimals()
  ) * quoteVaultConversionSample / baseVaultConversionSample;
```

## Thought

morpho oracle 雖然設計精良，尤其處理精度的部分，但是還是其缺陷的地方。在和 chainlink 整合的地方上，全盤相信 chainlink 不會失誤，所以忽略對 chainlink 報價的所有檢查：

```solidity
/// @dev https://github.com/morpho-org/morpho-blue-oracles/blob/630ca9a24065d577fb0d24717bd98f310722f729/src/morpho-chainlink/libraries/ChainlinkDataFeedLib.sol#L15-L19

/// @dev Notes on safety checks:
/// - L2s are not supported.
/// - Staleness is not checked because it's assumed that the Chainlink feed keeps its promises on this.
/// - The price is not checked to be in the min/max bounds because it's assumed that the Chainlink feed keeps its promises on this.
```

另外註解上寫 L2 不支援，不檢查 down L2 sequencer，卻仍有部署在 base 上。
## Reference

- https://github.com/morpho-org/morpho-blue-oracles
- [[ctx_chainlink_data_feed_integration]]
- [[note_erc_4626]]
