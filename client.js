const countElement = document.getElementById('count');
const incrementButton = document.getElementById('increment-button');
const statusElement = document.getElementById('status');

// 自宅 Crostini の IP アドレスとポートを指定
// GitHub Pages からアクセスするため、直接 IP アドレスとポートを記述します。
// ポートは server.js で設定しているもの (デフォルトは 3000)
const CROSTINI_SERVER_IP = '100.115.92.203'; // あなたの Crostini IP アドレスに修正済み
const CROSTINI_SERVER_PORT = '3000'; // server.js で設定したポート

const wsProtocol = 'ws:'; // GitHub Pages が HTTPS でも、Crostini が HTTP なら ws: を使う
const ws = new WebSocket(`${wsProtocol}//${CROSTINI_SERVER_IP}:${CROSTINI_SERVER_PORT}`);

ws.onopen = () => {
  statusElement.textContent = 'Crostini サーバーに接続しました。';
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'update') {
    countElement.textContent = data.count;
  }
};

ws.onclose = () => {
  statusElement.textContent = 'Crostini サーバーから切断されました。リロードしてください。';
  statusElement.style.color = 'red';
  incrementButton.disabled = true;
};

ws.onerror = (error) => {
  console.error('WebSocket Error:', error);
  statusElement.textContent = 'Crostini サーバーとの接続エラーが発生しました。';
  statusElement.style.color = 'red';
};

incrementButton.addEventListener('click', () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send('increment');
  }
});
