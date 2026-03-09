const countElement = document.getElementById('count');
const incrementButton = document.getElementById('increment-button');
const statusElement = document.getElementById('status');

// WebSocketの接続先を、**ルーターのグローバルIPアドレス**と**開けたポート**に設定
// Crostiniの内部IP (100.115.92.203) や CrostiniのNode.jsサーバーのポート (3000) は、
// ルーターが内部で適切に転送してくれるので、クライアントからはグローバルIPと外部ポートに接続します。
const GLOBAL_ROUTER_IP = '14.11.64.33'; // ★あなたのルーターのグローバルIPアドレスに置き換え済み
const EXTERNAL_PORT = '4352'; // ★ルーターで開ける外部ポート番号に置き換え済み (例として4352)

const wsProtocol = 'ws:';
const ws = new WebSocket(`${wsProtocol}//${GLOBAL_ROUTER_IP}:${EXTERNAL_PORT}`);

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
