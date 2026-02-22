---
title: "[context] foundry global config"
description: 
permalink: 
tags:
  - foundry
draft: false
created: 2024-12-08, 22:03
updated: 2025-06-27, 00:04
---
Foundry 的設定檔分為 project level 和 global level，可以將一些設定放到 global config 裡面，以避免重複設定

## global config file

global config 設定存在 `$HOME/.foundry/foundry.toml`，可以建立或是修改 `foundry.toml` 即可

## Personal Config

有關 rpc 和 verification 相關的參數都設定在全域，這樣就不需要為每個專案都設定一次 RPC endpoint 和 verification 相關的 api key。設定如下：

```toml
# $HOME/.foundry/foundry.toml
[rpc_endpoints]
mainnet  = "https://..."

[etherscan]
mainnet = { key = "API_KEY", chain = "mainnet" }
```

## Benefits

設定之後可以在不同專案的測試中跑 fork test，填入設定的 endpoint name 即可：

```solidity
import "forge-std/Test.sol";

contract ForkTest is Test {
    function testFork() external {
        vm.createSelectFork("mainnet");
    }
}
```

或是以 forge script 執行交易：

```solidity
import "forge-std/Script.sol";

contract ForkTest is Script {
    function run() external {
        vm.createSelectFork("mainnet");
    }
}
```

```bash
forge script ... --rpc-url mainnet
```

相關的 cli 也可以使用已設定的 rpc endpoint，將 endpoint name 可以接在 `--rpc-url` 後面即可，舉例：

```bash
cast chain-id --rpc-url mainnet
```

## Reference

- https://book.getfoundry.sh/reference/config/overview#global-configuration
