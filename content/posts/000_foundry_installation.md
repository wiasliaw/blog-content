---
title: foundry installation
description: 
permalink: 
tags:
  - foundry
draft: false
created: 2025-05-19, 19:48
updated: 2025-06-27, 00:06
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
