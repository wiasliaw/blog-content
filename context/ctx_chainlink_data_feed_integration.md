---
title: "[context] chainlink data feed integration"
description: "[context] chainlink data feed integration"
tags:
  - context
  - defi-oracle
  - protocol-chainlink
draft: false
created: 2025-01-11
modified: 2025-01-12
---
## chainlink interface

```solidity
interface AggregatorV3Interface {
  function decimals() external view returns (uint8);

  function description() external view returns (string memory);

  function version() external view returns (uint256);

  function getRoundData(
    uint80 _roundId
  ) external view returns (
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  );

  function latestRoundData() external view returns (
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  );
}
```

## integration

```solidity
pragma solidity ^0.8.0;

contract ChainlinkIntegrationSnippet {
  address public feed;

  constructor(address feed_) {
    feed = feed_;
  }

  function getPrice() external view returns (uint256) {
    // fetch price
    (
      /* uint80 roundId */,
      int256 answer,
      /* uint256 startedAt */,
      /* uint256 updatedAt */,
      /* uint80 answeredInRound */
    ) = AggregatorV3Interface(feed).latestRoundData();

    // safe cast
    return uint256(answer);
  }
}
```
