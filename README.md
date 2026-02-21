# 日隅Ai Hair Salon LINE Bot

🤖 AI 髮型顧問機器人

## 功能

- 💇 智能對話 - 髮型推薦、預約諮詢
- 📸 圖片分析 - 傳照片分析適合髮型（開發中）
- 💆 保養建議 - 護髮小貼士
- 🎯 自動回覆 - 24/7 即時回應

## 部署到 Zeabur

### 1. 建立 LINE Bot

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 建立 Provider 和 Messaging API Channel
3. 取得：
   - `Channel Secret`
   - `Channel Access Token`

### 2. 部署到 Zeabur

1. Fork 此專案到你的 GitHub
2. 在 Zeabur 建立新服務
3. 連接 GitHub 倉庫
4. 設定環境變數：

```bash
LINE_CHANNEL_SECRET=你的ChannelSecret
LINE_CHANNEL_ACCESS_TOKEN=你的AccessToken
```

5. 部署完成後，複製 Zeabur 給的網址

### 3. 設定 LINE Webhook

回到 LINE Developers Console：

1. Messaging API 設定
2. Webhook URL：`https://你的Zeabur域名/webhook`
3. 啟用 Webhook
4. 關閉「自動回覆訊息」

## 本地開發

```bash
# 安裝依賴
npm install

# 設定環境變數
export LINE_CHANNEL_SECRET=你的ChannelSecret
export LINE_CHANNEL_ACCESS_TOKEN=你的AccessToken

# 啟動伺服器
npm start
```

伺服器會在 `http://localhost:3000` 啟動

## 測試端點

- `GET /` - 服務狀態
- `GET /health` - 健康檢查
- `POST /webhook` - LINE Webhook

## 技術架構

- **Node.js** v18+
- **Express** 4.x
- **@line/bot-sdk** 9.x

## 授權

MIT License
