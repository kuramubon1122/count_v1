const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const countFilePath = path.join(__dirname, 'count.txt');

// --- カウントデータの読み書き ---
let count = 0;
// サーバー起動時にファイルからカウントを読み込む
try {
  if (fs.existsSync(countFilePath)) {
    count = parseInt(fs.readFileSync(countFilePath, 'utf8'), 10);
  } else {
    // ファイルがなければ0で作成
    fs.writeFileSync(countFilePath, '0');
  }
} catch (err) {
  console.error('Error reading count file:', err);
  count = 0; // エラー時も0で開始
}

// カウントをファイルに書き込む関数
function saveCount() {
  fs.writeFile(countFilePath, count.toString(), (err) => {
    if (err) {
      console.error('Error writing count file:', err);
    }
  });
}

// --- WebSocket通信の処理 ---
wss.on('connection', (ws) => {
  // 接続時に現在のカウントを送信
  ws.send(JSON.stringify({ type: 'update', count: count }));

  // クライアントからメッセージを受信したとき
  ws.on('message', (message) => {
    if (message.toString() === 'increment') {
      count++;
      saveCount();
      // 接続している全クライアントに更新を通知 (ブロードキャスト)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'update', count: count }));
        }
      });
    }
  });
});

// --- Webサーバーの設定 ---
// publicディレクトリのファイルを静的ファイルとして提供
app.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`Crostini Counter server started on port ${PORT}`);
});
