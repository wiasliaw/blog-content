---
title: "[context] nix installation"
description: 
permalink: 
tags:
  - context
  - nix
draft: false
created: 2024-12-08, 22:49
updated: 2024-12-08, 23:18
---
## Installation for macOS

- 在 macOS 上推薦以 multi-user mode 安裝
- `$VERSION` 為對應的發行版本，個人以最新的版本 `2.21.0` 安裝

```bash
curl -L https://releases.nixos.org/nix/nix-$VERSION/install | sh -s -- --daemon
```
