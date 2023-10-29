const express = require('express');

const server = express()
  .use((req, res) => res.sendFile('/index.html', { root: __dirname }))
  .listen(3000, () => console.log(`Listening on ${3000}`));
  
const { Server } = require('ws');

const ws_server = new Server({ server });

ws_server.on('connection', (ws) => {
  console.log('New client connected!');
  ws.on('close', () => console.log('Client has disconnected!'));
});

// ----------

setInterval(() => {
	
  ws_server.clients.forEach((client) => {

	x=parseInt(Math.random()*4);
    client.send(x);

  });
  
}, 1000);
