const countElement = document.getElementById('count');
const incrementButton = document.getElementById('increment-button');
const statusElement = document.getElementById('status');

// WebSocketの接続先を、**ルーターのグローバルIPアドレス**と**開けた外部ポート**に設定
// GitHub Pagesが http://count.nyankohack.tokyo/ から読み込まれるため、
// 異なるオリジンへの接続になりますが、サーバー側でCORSを許可します。
const GLOBAL_ROUTER_IP = '14.11.64.33'; // ★あなたのルーターのグローバルIPアドレス
const EXTERNAL_PORT = '4352'; // ★ルーターで開ける外部ポート (例として4352)

// ws: プロトコルで、指定したグローバルIPと外部ポートに接続
const ws = new WebSocket(`ws://${GLOBAL_ROUTER_IP}:${EXTERNAL_PORT}`);

ws.onopen = () => {
  statusElement.textContent = 'Crostini サーバーに接続しました。';
  statusElement.style.color = 'green';
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
