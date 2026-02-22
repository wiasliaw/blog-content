---
title: evm BLS12-381 precompile
description: 簡介 ERC-2537
tags:
  - eip
  - evm-precompiled
  - cryptography
draft: false
created: 2025-04-19
modified: 2025-04-22
---
[EIP-2537](https://eips.ethereum.org/EIPS/eip-2537)，BLS12-381 橢圓曲線相關的基本功能會以 precompile contracts 的方式在 Pectra 上線，主要為了支援 BLS 數位簽名的驗證。

## Point Encoding

首先需要注意的是 Point 的 encoding。BLS12-381 是一條 pairing-friendly 的橢圓曲線，其 Prime Field 有 381 bits，大於所有 EVM 原生型別的大小。

在 $G_1$ 上的 Point 其 X 座標和 Y 座標皆屬於 BLS12-381 Prime Field，所以 EIP 中規定以 64 bytes 進行 Encoding，而這 64 bytes 最前面會有 16 bytes 為零，Layout 如下：

| 16 bytes | 48 bytes (384 bits) |
| -------- | ------------------- |
| 0x00..00 | $F_p$               |

$G_2$ 為 extension field，其點座標被記作 $(C_0 + C_1 \cdot i)$，裡面 $C_0,\ C_1$ 皆屬於 $F_p$，所以一個 $G_2$ 的 Point 以 128 bytes 以記錄兩個 $F_p$ 元素，Layout 如下：

| 16 bytes   | 48 bytes (384 bits) | 16 bytes   | 48 bytes (384 bits) |
| ---------- | ------------------- | ---------- | ------------------- |
| `0x00..00` | $C_0 \in F_p$       | `0x00..00` | $C_1 \in F_p$       |

## BLS12_G1ADD(0x0b)

在 $G_1$ 上的 point addition，數學式如下：

$$
\begin{align*}
P + Q &= R \\ 
(x_P, y_P) + (x_Q, y_Q) &= (x_Q, y_Q)
\end{align*}
$$

### ABI

由於是以 contract interaction 的形式呼叫，所以 `calldata` 需要按照相應的格式排列好。`BLS12_G1ADD` 需要從 `calldata` 解析出兩個在 $G_1$ 上的 Point，並按照 (x, y) 的順序排好：

| Calldata Bytes Range | Name |
| -------------------- | ---- |
| `[0; 64]` (64 bytes) | x1   |
| `[64; 128]`          | y1   |
| `[128; 192]`         | x2   |
| `[192; 256]`         | y2   |

## BLS12_G1MSM(0x0c)

在 $G_1$ 上的 Multi-Scalar Multiplication，數學式如下：

$$
\begin{align*}
[P_1,P_2...P_n] &\in G_1 \\ 
[k_1,k_2...k_n] &\in F_p \\
Q &= \sum^{n}_{i} k_i \cdot P_i
\end{align*}
$$

### ABI

Multi-Scalar Multiplication 可以傳入多組 (Point, k) 做計算，單一組 (Point, k) 在 `calldata` 的 Layout 如下：

| Calldata Bytes Range | Name |
| -------------------- | ---- |
| `[0; 64]` (64 bytes) | x1   |
| `[64; 128]`          | y1   |
| `[128; 192]`         | k1   |
| ...                  |      |

## BLS12_G2ADD(0x0d)

在 $G_2$ 上的 point addition，數學式和 G1ADD 相同。

### ABI

`BLS12_G2ADD` 需要從 `calldata` 解析出兩個在 $G_2$ 上的 Point，並按照 (x, y) 的順序排好：

| Calldata Bytes Range | Name  |
| -------------------- | ----- |
| `[0; 64]` (64 bytes) | x1_c0 |
| `[64; 128]`          | x1_c1 |
| `[128; 192]`         | y1_c0 |
| `[192; 256]`         | y1_c1 |
| `[256; 320]`         | x2_c0 |
| `[320; 384]`         | x2_c1 |
| `[384; 448]`         | y2_c0 |
| `[448; 512]`         | y2_c1 |

## BLS12_G2MSM(0x0e)

在 $G_2$ 上的 Multi-Scalar Multiplication，數學式和 G1MSM 相同。

### ABI

Multi-Scalar Multiplication 可以傳入多組 (Point, k) 做計算，第一組 (Point, k) 在 `calldata` 的 Layout 如下：

| Calldata Bytes Range | Name  |
| -------------------- | ----- |
| `[0; 64]` (64 bytes) | x1_c0 |
| `[64; 128]`          | x1_c1 |
| `[128; 192]`         | y1_c0 |
| `[192; 256]`         | y1_c1 |
| `[256; 320]`         | k_1   |
| ...                  |       |

## BLS12_PAIRING_CHECK(0x0f)

BLS12-381 的 Pairing 計算，數學式如下：

$$
\begin{align*}
e: G_1 \times G_2 \rightarrow G_T
\end{align*}
$$

### ABI

和 [[evm_bn254_precompile|bn254]] 一樣是 Batch Pairing 的運算：

$$
e(P1, Q1) \cdot e(P2, Q2) ... e(Pk, Qk) = 1
$$

第一組 $G_1$ Point 和 $G_2$ Point 在 `calldata` 的 Layout 如下：

| Calldata Bytes Range | Name   |
| -------------------- | ------ |
| `[0; 64]` (64 bytes) | x_P    |
| `[64; 128]`          | y_P    |
| `[128; 192]`         | x_Q_c0 | 
| `[192; 256]`         | x_Q_c1 |
| `[256; 320]`         | y_Q_c0 |
| `[320; 384]`         | y_Q_c1 |

## BLS12_MAP_FP_TO_G1(0x10)

將一個 $F_p$ 映射到 $G_1$ 上

### ABI

輸入為一個 $F_p$ 元素，`calldata` 的 Layout 如下：

| Calldata Bytes Range | Name  |
| -------------------- | ----- |
| `[0; 64]` (64 bytes) | $F_p$ |

## BLS12_MAP_FP2_TO_G2(0x11)

將一個 $F_{p^2}$ 映射到 $G_2$ 上

### ABI

輸入為一個 $F_{p^2}$ 元素，`calldata` 的 Layout 如下：

| Calldata Bytes Range | Name |
| -------------------- | ---- |
| `[0; 64]` (64 bytes) | C_0  |
| `[64; 128]`          | C_1  |
