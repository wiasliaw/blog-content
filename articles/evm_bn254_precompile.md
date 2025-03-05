---
title: evm bn254 precompile
description: 
permalink: 
tags:
  - eip
  - evm/precompiled
  - cryptography
draft: false
created: 2025-03-05, 05:32
updated: 2025-03-05, 23:50
---
為了支援 zkSNARK 驗證，EVM 很早以前就以 precompiled contracts 支援 bn254，一條 pairing-friendly 的橢圓曲線。

## precompiled contracts

precompiled contracts 是綁定在固定地址的特殊合約，以定義好的 gas 呼叫，可以支援一些 gas 消耗特別大的計算。

## ecAdd(0x06)

橢圓曲線 bn254 上的 Point Addition，數學式如下：

$$
\begin{align*}
P + Q &= R \\ 
(x_P, y_P) + (x_Q, y_Q) &= (x_Q, y_Q)
\end{align*}
$$

### ABI

由於是以 contract interaction 的形式呼叫，所以 caldate 需要按照相應的格式排列好。`ecAdd` 需要從 calldata 解析出兩個在 $G_1$ 上的 Point，並按照 (x, y) 的順序排好：

| Calldata Bytes Range   | Name |
| ---------------------- | ---- |
| `[0; 31]` (32 bytes)   | x1   |
| `[32; 63]` (32 bytes)  | y1   |
| `[64; 95]` (32 bytes)  | x2   |
| `[96; 127]` (32 bytes) | y2   |

以下是 [evm codes 給的範例](https://www.evm.codes/playground?unit=Wei&codeType=Mnemonic&code=%27qFirsQplacejparameters%20in%20memoryK1~V1_2bK2_4V2_6bvvqDojcall_4WSize_8WOffset_8YSize~YOffset~6waddressX4%200xFFFFFFFFwgasvSTATICCALLvvqPutjresulQalonNonjstackvPOP_AZ_8Z%27~X1%20w%20qv%5Cnq%2F%2F%20j%20thNb0vMSTORE_~0xZ0vMLOADY0wargsXvPUSHW0wretVb~2wyQt%20Ne%20K~1wx%01KNQVWXYZ_bjqvw~_) :

```evm
// (1, 2) + (1, 2)
PUSH1 1 // x1
PUSH1 0
MSTORE
PUSH1 2 // y1
PUSH1 0x20
MSTORE
PUSH1 1 // x2
PUSH1 0x40
MSTORE
PUSH1 2 // y2
PUSH1 0x60
MSTORE

// Do the call
PUSH1 0x40 // retSize
PUSH1 0x80 // retOffset
PUSH1 0x80 // argsSize
PUSH1 0 // argsOffset
PUSH1 6 // address
PUSH4 0xFFFFFFFF // gas
STATICCALL

// Put the result alone on the stack
POP
PUSH1 0xA0
MLOAD
PUSH1 0x80
MLOAD

// stack result
// [0]  30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd3
// [1] 15ed738c0e0a7c92e7845f96b2ae9c0a68a6a449e3538fc7ff3ebf7a5a18a2c4
```

計算結果可以用 `@noble/curves` 重現：

```js
import { bn254 } from "@noble/curves/bn254";
const { Fp } = bn254.fields;

// (1, 2)
const pointA = bn254.G1.ProjectivePoint.fromAffine({
  x: Fp.create(1n),
  y: Fp.create(2n)
});
const pointB = pointA;

// ecAdd
const pointC = pointA.add(pointB);

// result:
// x:   30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd3
// y:  15ed738c0e0a7c92e7845f96b2ae9c0a68a6a449e3538fc7ff3ebf7a5a18a2c4
console.log("result:");
console.log("x: ", pointC.toAffine().x.toString(16));
console.log("y: ", pointC.toAffine().y.toString(16));
```

## ecMul(0x07)

橢圓曲線上的 Point Scalar Multiplication，數學式如下：

$$
s\cdot P = P + ... + P = Q
$$

### ABI

`ecMul` 需要從 calldata 解析出一個在 $G_1$ 上的 Point 還有一個 Scalar：

| Calldata Bytes Range  | Name |
| --------------------- | ---- |
| `[0; 31]` (32 bytes)  | x1   |
| `[32; 63]` (32 bytes) | y1   |
| `[64; 95]` (32 bytes) | s    |

以下是 [evm codes 給的範例](https://www.evm.codes/playground?unit=Wei&codeType=Mnemonic&code='wFirsVplacejparameters%20in%20memory~1qx1~Ny1_2Ns_4bvvwDojcall_4WSize_6WOffset_6YSize~YOffset~7qaddressX4%200xFFFFFFFFqgasvSTATICCALLvvwPutjresulValonQonjstackvPOP_8Z_6Z'~X1q//%20v%5Cnq%20wj%20thQb0vMSTORE_~0xZ0vMLOADY0qargsXvPUSHW0qretVt%20Qe%20Nb~2q%01NQVWXYZ_bjqvw~_) :

```evm
// (1, 2) * 2 === (1, 2) + (1, 2)
PUSH1 1 // x1
PUSH1 0
MSTORE
PUSH1 2 // y1
PUSH1 0x20
MSTORE
PUSH1 2 // s
PUSH1 0x40
MSTORE

// Do the call
PUSH1 0x40 // retSize
PUSH1 0x60 // retOffset
PUSH1 0x60 // argsSize
PUSH1 0 // argsOffset
PUSH1 7 // address
PUSH4 0xFFFFFFFF // gas
STATICCALL

// Put the result alone on the stack
POP
PUSH1 0x80
MLOAD
PUSH1 0x60
MLOAD

// stack result
// [0]  30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd3
// [1] 15ed738c0e0a7c92e7845f96b2ae9c0a68a6a449e3538fc7ff3ebf7a5a18a2c4
```

計算結果重現：

```js
import { bn254 } from "@noble/curves/bn254";
const { Fp } = bn254.fields;

// (1, 2)
const pointA = bn254.G1.ProjectivePoint.fromAffine({
  x: Fp.create(1n),
  y: Fp.create(2n)
});

// ecMul
const pointC = pointA.multiply(2n);

// result:
// x:   30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd3
// y:  15ed738c0e0a7c92e7845f96b2ae9c0a68a6a449e3538fc7ff3ebf7a5a18a2c4
console.log("result:");
console.log("x: ", pointC.toAffine().x.toString(16));
console.log("y: ", pointC.toAffine().y.toString(16));
```

## ecPairing(0x08)

Pairing 是一種來自橢圓曲線密碼的的數學運算，它將兩個橢圓曲線上的點映射到一個有限域的元素。這種運算大量應用於密碼學，如身份驗證、零知識證明等。數學式如下：

$$
\begin{align*}
e: G_1 \times G_2 \rightarrow G_T
\end{align*}
$$

Pairing 有一些適合用於驗證的計算特性：

$$
e(m \cdot G_1,\ n \cdot G_2)
= e(G_1,\ mn \cdot G_2)
= e(mn \cdot G_1,\ G_2)
= e(G_1,\ G_2)^{mn}
$$

### short example

舉一個簡單的範例，給定一個 scalar 為私鑰，其公鑰為私鑰和 $G_1$ 的 Point Scalar Multiplication：

$$
publicKey = privateKey \cdot G_1
$$

給定一個訊息 $m$，簽名流程如下，雜湊函數 $Hash$ 會將訊息映射到 $G_2$ 上：

$$
\sigma = Hash(m)\cdot privateKey
$$

驗證時需要「公鑰」、「訊息」和「簽名」，數學式如下：

$$
\begin{align*}
e(\ publicKey,\ Hash(m)\ ) & \\
  &= e(\ privateKey \cdot G_1,\ Hash(m)\ ) \\
  &= e(\ G_1,\ privateKey \cdot Hash(m)\ ) \\
  &= e(\ G_1,\ \sigma\ )
\end{align*}
$$

ecPairing 的主要目的是為了驗證，也不需要回傳 $G_T$ 值，所以將右側的 Pairing 放到左側，以減少 $G_T$ 的計算。以上面 short example 的例子，驗證的數學式可以修改成下面的形式：

$$
\begin{align*}
e(\ publicKey,\ Hash(m)\ ) \cdot e(\ G_1,\ \sigma\ )^{-1} = 1\in G_T
\end{align*}
$$

### ABI

ecPairing 是一個 batch pairing 的實作，可以傳入多組的 $G_1$ 和 $G_2$ 的 Point Pair 一塊做 pairing，：

$$
e(P_1,\ Q_1) \cdot e(P_2,\ Q_2) \cdot ... e(P_k,\ Q_k) \stackrel{?}{=} 1 \in G_T
$$

第一組 Point Pair 在 calldata region 的 layout 如下：

| Calldata Bytes Range    | Name                 |
| ----------------------- | -------------------- |
| `[0; 31]` (32 bytes)    | x1 of Point in G_1   |
| `[32; 63]` (32 bytes)   | y1 of Point in G_1   |
| `[64; 95]` (32 bytes)   | x_c1 of Point in G_2 |
| `[96; 127]` (32 bytes)  | x_c0 of Point in G_2 |
| `[128; 159]` (32 bytes) | y_c1 of Point in G_2 |
| `[160; 191]` (32 bytes) | y_c0 of Point in G_2 |

實際範例可以參考 [evm.codes](https://www.evm.codes/precompiled?fork=cancun#0x08)，而以 `@noble/curves` 撰寫的腳本如下：

```js
import { bn254 } from "@noble/curves/bn254";
const { Fp, Fp2, Fp12 } = bn254.fields;

// G1
const Generator1 = bn254.G1.ProjectivePoint.fromAffine({
  x: Fp.create(1n),
  y: Fp.create(2n)
});
Generator1.assertValidity();

// G2
const G2x = Fp2.fromBigTuple([
  BigInt('10857046999023057135944570762232829481370756359578518086990519993285655852781'),
  BigInt('11559732032986387107991004021392285783925812861821192530917403151452391805634'),
]);
const G2y = Fp2.fromBigTuple([
  BigInt('8495653923123431417604973247489272438418190587263600148770280649306958101930'),
  BigInt('4082367875863433681332203403145435568316851327593401208105741076214120093531'),
]);
const Generator2 = bn254.G2.ProjectivePoint.fromAffine({ x: G2x, y: G2y});
Generator2.assertValidity();

// prepare data
const pointALeft = Generator1.multiply(3n);
const pointBLeft = Generator2.multiply(7n);
const pointARight = Generator1.multiply(21n);
const pointBRight = Generator2;

// pairing
// e(3, 7) === e(21, 1)
const resultLeft = bn254.pairing(pointALeft, pointBLeft);
const resultRight = bn254.pairing(pointARight, pointBRight);
console.log(Fp12.eql(resultLeft, resultRight));

// pairing batch
// e(3, 7) * e(-21, 1) === 1 (in G_T)
const resultBatch = bn254.pairingBatch([
  { g1: pointALeft, g2: pointBLeft},
  { g1: pointARight.negate(), g2: pointBRight},
]);
console.log(Fp12.eql(resultBatch, Fp12.ONE));

// console.log
// true
// true
```

## Reference

- https://eips.ethereum.org/EIPS/eip-196
- https://eips.ethereum.org/EIPS/eip-197
