![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)


# 待辦清單 Web App 作品集

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App，旨在展示如何用 Agent Mode、MCP 與 agentic workflow 協助前端開發，並在有限的技術限制下完成一個可運作、可持久化的實用工具。

## 線上展示

GitHub Pages 佔位：
https://kaonei02.github.io/alan-copilot-workshop/

> 這個網址會在你實際部署後自行替換成正式的 GitHub Pages URL。

## 功能

這個 App 目前提供以下功能：

- 新增待辦事項
- 刪除單一待辦事項
- 標記待辦事項為已完成或未完成
- 顯示未完成項目數量
- 依照狀態篩選清單：全部、未完成、已完成
- 在篩選結果為空時顯示清楚的提示訊息
- 清除所有已完成項目（需確認後再刪除）
- 使用 localStorage 持久保存待辦資料
- 支援簡潔的深色模式與亮色模式切換

## 技術

本專案採用純前端實作，僅使用：

- HTML
- CSS
- 原生 JavaScript

技術重點如下：

- 不使用任何框架或第三方套件
- 不依賴外部 CDN
- 資料儲存在 browser 的 localStorage 中，讓重新整理後仍能保留狀態
- 使用 CSS 變數管理主題色與共用樣式，維持一致性的視覺設計
- 程式邏輯以簡單、可讀的前端腳本形式實作，便於維護與學習

## 開發方式

這個專案是依照 GitHub Copilot 實戰工作坊的流程完成的，主要涵蓋三種協作方式：

1. GitHub Copilot Agent Mode
   - 透過自然語言指令生成前端結構與互動邏輯
   - 讓開發者可以在較短時間內建立可運作的原型

2. MCP（Model Context Protocol）
   - 連接 GitHub Issue 與 Microsoft Learn 文件資源
   - 讓 AI 能直接閱讀 issue 要求、查詢官方文件，並將資訊轉成符合專案需求的修正方案

3. .github/prompts 的 agentic workflow
   - 使用固定的 prompt 腳本來定義修正 issue 的流程：讀 issue → 提出計畫 → 建分支 → 修改程式 → 驗證 → 提交 → 開 PR
   - 這種方式讓問題處理流程更一致，也有助於降低人工步驟造成的遺漏

這個專案的重點不在於複雜技術堆疊，而是在有限範圍內透過 AI 協作提升開發效率並保留工程可控性。

## 我學到什麼

- 如何把自然語言需求轉成可執行的前端功能
- GitHub Copilot 在工程流程中的實際協作方式，不只是寫程式，也能協助分析問題與驗證修正
- MCP 能將 AI 的資訊來源擴展到官方文件與專案 issue，讓決策更有依據
- Agentic workflow 能把重複性的開發步驟整理成可重複執行的流程
- 在純前端專案中，維持簡潔架構與良好使用者體驗，同樣重要，甚至比引入更多技術更值得優先考慮

---

這份作品集文件反映的是一個以學習為主、以實作為核心的前端專案，重視清楚需求、穩定功能與可驗證成果，而非過度包裝或誇大技術表現。
