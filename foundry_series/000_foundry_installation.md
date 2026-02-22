---
title: foundry installation
description: foundry installation
tags:
  - foundry
draft: false
created: 2025-05-19
modified: 2025-05-21
---
## Using Foundryup

```sh
curl -L https://foundry.paradigm.xyz | bash
```

## Building from Source

```sh
cargo install --git https://github.com/foundry-rs/foundry --profile release --locked forge cast chisel anvil
```

## Docker

```sh
docker pull ghcr.io/foundry-rs/foundry:latest
```
