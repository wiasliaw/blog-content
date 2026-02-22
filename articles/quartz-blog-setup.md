---
title: Quartz Blog Setup
description: "Quartz Blog Setup"
tags:
  - quartz
  - obsidian
draft: false
created: 2024-12-07
modified: 2025-03-04
---
以 [Quartz](https://quartz.jzhao.xyz/) 建立和維護 Blog

## Setup

本站 blog 以 Quartz 建構而成，這是一個 static site generator 可以將 markdown 轉換成靜態網站，可以為網站附帶一些類似 obsidian 相關的功能，例如 Graph View 和 Backlinks 等等，也有一定程度的客製化。

初始化的過程十分簡單，可以在 GitHub 建立 repo 時直接使用 quartz 的 template：

![](/assets/2025_0304_2054.png)

將 repo clone 下來後，文章內容放在 `/content` folder 裡面，安裝 nodejs 需要的 dependencies 即可：

```bash
npm ci && npx quartz build --serve
```

## Maintain

Quartz 和其他 static-site generator 不太一樣的地方是：一般的 static-site generator 只需要以 cli 下指令，將 markdown 處理成靜態網頁，而 Quartz 則是將 source code 整個打包給使用者，不是分發一個 cli。這給維護上造成了一些麻煩，在更新 Quartz 時需要從原作者的 repo 合併最新的 commit 到使用者的 repo 裡面，而使用者的 repo 也會混雜一些有關 content 的 commit。沒有特別處理 branch 的話，很容易處理兩種不同的 commit 處理到腦袋打結。

### repo & branch

為了區分 quartz source code 和 content，我分成兩個 repo，其分支如下:

```txt
"repo:wiasliaw/blog-content"
    - "branch:main" 存放文章內容
"repo:wiasliaw/quartz-blog" <- forked from "repo:jackyzha0/quartz"
    - "branch:v4" 用於同步上游的更新
    - "branch:release" 同步文章內容並用於部署
```

`branch:release` 分支是透過 git submodule 將文章內容同步進來。更新只需要更新 git submodule，不需要複製貼上，或是將文章內容的 repo 置於 blog 的 repo 裡面，將內容和 source code 解耦 ：

```bash
git submodule add <REPO> content
```

## Reference

- https://quartz.jzhao.xyz/
