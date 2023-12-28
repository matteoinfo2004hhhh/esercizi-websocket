const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const ws_server = new WebSocket.Server({ server });

const PORT = 3000;

let pos1 = { x: 3, y: 2 };
let pos2 = { x: 4, y: 3 };

ws_server.on('connection', (ws) => {
   console.log('New client connected!');

   ws.on('close', () => console.log('Client has disconnected!'));

   // Send initial positions to the newly connected client
   let initialData = { info: { posx1: pos1.x, posy1: pos1.y, posx2: pos2.x, posy2: pos2.y } };
   ws.send(JSON.stringify(initialData));
});

setInterval(() => {
   ws_server.clients.forEach((client) => {
      pos1.x = (pos1.x + 1) % 10;
      pos1.y = (pos1.y + 1) % 10;

      pos2.x = (pos2.x + 1) % 10;
      pos2.y = (pos2.y + 2) % 10;

      let info = { posx1: pos1.x, posy1: pos1.y, posx2: pos2.x, posy2: pos2.y };
      const data = JSON.stringify({ info: info });
      client.send(data);
   });
}, 1000);

// Serve index.html for the root route
app.get('/', (req, res) => {
   res.sendFile('index.html', { root: __dirname });
});

// Serve static files
app.use(express.static(path.join(__dirname)));

server.listen(PORT, () => {
   console.log(`Server is listening on port ${PORT}`);
});
