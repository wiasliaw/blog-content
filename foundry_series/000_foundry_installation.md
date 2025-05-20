---
title: foundry installation
description: foundry installation
permalink: 
tags:
  - foundry
draft: false
created: 2025-05-19, 19:48
updated: 2025-05-21, 02:50
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
