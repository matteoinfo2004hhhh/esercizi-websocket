const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const ws_server = new WebSocket.Server({ server });

const PORT = 3000;

const rows = 10;
const cols = 10;
const matrix = createMatrix(rows, cols);

function createMatrix(rows, cols) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = Math.floor(Math.random() * 21) + 20; // Random number between 20 and 40
    }
  }
  return matrix;
}

ws_server.on('connection', (ws) => {
   console.log('New client connected!');

   ws.on('close', () => console.log('Client has disconnected!'));
   
   // Send the initial matrix to the newly connected client
   ws.send(JSON.stringify({ matrix }));

   ws.on('message', (data) => {
      const parsedData = JSON.parse(data);
      const { row, col, value } = parsedData;

      // Update the matrix
      matrix[row][col] = value;

      // Broadcast the updated matrix to all connected clients
      ws_server.clients.forEach((client) => {
         if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ matrix }));
         }
      });
   });
});

app.use(express.static(path.join(__dirname)));

server.listen(PORT, () => {
   console.log(`Server is listening on port ${PORT}`);
});
