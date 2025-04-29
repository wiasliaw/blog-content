---
title: BLS Signature
description: 簡介 BLS Signature
permalink: 
tags:
  - cryptography
draft: false
created: 2025-04-29, 04:48
updated: 2025-04-29, 15:07
---
有了 [[evm_bls12-381_precompile|bls12-381]] 的 precompile 的支援，就可以實作 BLS Signature。

## Hashing to the curve

BLS Signature 對於訊息雜湊有作略微的修改，將訊息的雜湊值直接對應到橢圓曲線上，以下借用 reference^[https://medium.com/cryptoadvance/bls-signatures-better-than-schnorr-5a7fe30ea716] 的圖示：

![[2025_0429_0509.png]]

最簡單的方法是像往常一樣對訊息進行雜湊處理 (在 evm 以 keccak256 最為方便)，並將結果視為點的 X 座標，代入橢圓曲線計算是否有對應的 Y 座標。由於並不是每個 X 都找得到 Y 座標出來，所以會在雜湊附加上額外的訊息，例如 counter 之類的計數器，找不到則增加 counter 再計算一次，直到找到為止。

## Key Generation

公私鑰的產生方式和一般橢圓曲線密碼學差不多，私鑰為一個 scalar，公鑰為 $G_1$ 上的點。數學式如下：

$$
\begin{align*}
privkey &= d \in F_p \\
pubkey &= [d] G_1
\end{align*}
$$

## Sign

過程分兩個步驟，首先先計算出訊息的 Hash to curve:

$$
H(msg) = [h]G_2
$$

再來將其和私鑰相成以做成簽名 $S$:

$$
S = d \times H(msg) = [dh]G_2
$$

## Verify

驗證演算法需要三個 input:
- 公鑰 $pubkey = [d]G_1$
- 訊息 $msg$
- 簽名 $S$

驗證主要透過 Pairing 進行:

$$
\begin{align*}
e(pubkey,\ H(msg)) &\stackrel{?}{=} e([1]G_1,\ S) \\
e([d]G_1,\ [h]G_2) &\stackrel{?}{=} e([1]G_1,\ [dh]G_2) \\
[dh]G_T &\stackrel{?}{=} [dh]G_T
\end{align*}
$$

## Signature Aggregation

BLS12-381 可以支援 signature aggregation 功能，也就是將多個簽名聚合並一塊驗證。假設這邊有兩把私鑰，分別簽名了不同的訊息:

$$
\begin{align*}
privkey1 &= d_1 \in F_p \\
privkey2 &= d_2 \in F_p \\
pubkey1 &= [d_1]G_1 \\
pubkey2 &= [d_2]G_1 \\
S_1 &= [d_1h_1]G_2 \\
S_2 &= [d_2h_2]G_2
\end{align*}
$$

驗證如下：

$$
\begin{align*}
S_{sum} &= S_1 + S_2 = [d_1h_1 + d_2h_2]G_2 \\
\ \\
e([1]G_1,\ S_{sum}) &= e([1]G_1,\ S_1 + S_2) = e([1]G_1,\ S_1) \cdot e([1]G_1,\ S_2) \\
\ \\
e([1]G_1,\ S_1) \cdot e([1]G_1,\ S_2) &\stackrel{?}{=} e(pubkey_1,\ [h_1]G_2) \cdot e(pubkey_2,\ [h_2]G_2)
\end{align*}
$$
