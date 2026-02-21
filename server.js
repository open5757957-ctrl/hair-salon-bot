const express = require('express');
const line = require('@line/bot-sdk');

// 環境變數
const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || ''
};

const PORT = process.env.PORT || 3000;

// 建立 LINE Bot client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

// 建立 Express app
const app = express();

// 健康檢查端點
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: '日隅Ai Hair Salon Bot',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    node: process.version,
    env: {
      hasSecret: !!config.channelSecret,
      hasToken: !!config.channelAccessToken,
      port: PORT
    }
  });
});

// LINE Webhook 端點
app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    const results = await Promise.all(req.body.events.map(handleEvent));
    res.json({ success: true, results });
  } catch (err) {
    console.error('Webhook 處理錯誤:', err);
    res.status(500).json({ error: err.message });
  }
});

// 處理 LINE 事件
async function handleEvent(event) {
  console.log('收到事件:', event.type);

  // 處理文字訊息
  if (event.type === 'message' && event.message.type === 'text') {
    const userMessage = event.message.text;
    console.log('用戶訊息:', userMessage);

    // 簡單回覆邏輯
    let replyText = '您好！我是日隅Ai Hair Salon 智能客服 💇\n\n';
    
    if (userMessage.includes('髮型') || userMessage.includes('推薦')) {
      replyText += '想要髮型推薦嗎？請傳送您的照片，我會為您分析適合的髮型！📸';
    } else if (userMessage.includes('預約') || userMessage.includes('時間')) {
      replyText += '預約服務請撥打：(02)1234-5678\n或加入官方 LINE 預約 📅';
    } else if (userMessage.includes('保養') || userMessage.includes('護理')) {
      replyText += '護髮小貼士：\n✨ 定期使用護髮素\n✨ 避免過度使用熱工具\n✨ 充足睡眠保持頭髮健康';
    } else {
      replyText += '您可以問我：\n• 髮型推薦\n• 預約服務\n• 護髮保養';
    }

    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: replyText }]
    });
  }

  // 處理圖片訊息
  if (event.type === 'message' && event.message.type === 'image') {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'text',
        text: '收到您的照片了！🎨\n\n目前 AI 分析功能開發中，敬請期待...\n\n如需專業髮型建議，歡迎預約諮詢！'
      }]
    });
  }

  // 處理加入好友事件
  if (event.type === 'follow') {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'text',
        text: '歡迎來到日隅Ai Hair Salon！💇‍♀️\n\n我是您的專屬髮型顧問小助手～\n\n有任何髮型問題都可以問我哦！'
      }]
    });
  }

  return Promise.resolve(null);
}

// 啟動伺服器
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('✅ 日隅Ai Hair Salon Bot 啟動成功');
  console.log('=================================');
  console.log('Node 版本:', process.version);
  console.log('監聽位址: 0.0.0.0:' + PORT);
  console.log('環境變數:');
  console.log('  - LINE_CHANNEL_SECRET:', config.channelSecret ? '✓ 已設定' : '✗ 未設定');
  console.log('  - LINE_CHANNEL_ACCESS_TOKEN:', config.channelAccessToken ? '✓ 已設定' : '✗ 未設定');
  console.log('=================================');
});

// 錯誤處理
server.on('error', (err) => {
  console.error('❌ 伺服器錯誤:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('收到 SIGTERM，正常關閉...');
  server.close(() => {
    console.log('伺服器已關閉');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('未捕獲的異常:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未處理的 Promise 拒絕:', reason);
  process.exit(1);
});
