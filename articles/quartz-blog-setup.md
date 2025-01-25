---
title: Quartz Blog Setup
description: 
permalink: 
tags:
  - quartz
  - obsidian
draft: false
created: 2024-12-07, 19:59
updated: 2024-12-08, 22:39
---
本篇 blog 以 [Quartz](https://quartz.jzhao.xyz/) 建構而成，可以將 markdown 轉換成靜態網站，並附帶一些 obsidian 相關的功能，例如 Graph View 和 Backlinks 等等。

## Quartz

[官方文件](https://quartz.jzhao.xyz/)寫得蠻齊全的，可以按照網站指令直接來

```bash
git clone https://github.com/jackyzha0/quartz.git
cd quartz
npm i
npx quartz create
```

也可以透過 CI 部署到 GitHub Page，以下爲[官方文檔範例](https://quartz.jzhao.xyz/hosting#github-pages)：

```yaml
name: Deploy Quartz site to GitHub Pages
 
on:
  push:
    branches:
      - v4
 
permissions:
  contents: read
  pages: write
  id-token: write
 
concurrency:
  group: "pages"
  cancel-in-progress: false
 
jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Install Dependencies
        run: npm ci
      - name: Build Quartz
        run: npx quartz build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public
 
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Obsidian Plugin

只是用來寫 blog 並不需要太多特別的 plugin

- [Advanced Tables](https://github.com/tgrosinger/advanced-tables-obsidian)：處理 markdown 的 table
- [Update time on edit plugin](https://github.com/beaussan/update-time-on-edit-obsidian)：自動更新上次編輯時間
