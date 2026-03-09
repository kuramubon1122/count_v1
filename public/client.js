const countElement = document.getElementById('count');
const incrementButton = document.getElementById('increment-button');
const statusElement = document.getElementById('status');

const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

ws.onopen = () => {
  statusElement.textContent = 'サーバーに接続しました。';
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'update') {
    countElement.textContent = data.count;
  }
};

ws.onclose = () => {
  statusElement.textContent = 'サーバーから切断されました。リロードしてください。';
  statusElement.style.color = 'red';
  incrementButton.disabled = true;
};

ws.onerror = (error) => {
  console.error('WebSocket Error:', error);
  statusElement.textContent = '接続エラーが発生しました。';
  statusElement.style.color = 'red';
};

incrementButton.addEventListener('click', () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send('increment');
  }
});
