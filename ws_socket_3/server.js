const express = require('express');

const server = express()
  .use((req, res) => res.sendFile('/index.html', { root: __dirname }))
  .listen(3000, () => console.log('Listening on 3000'));
  
const { Server } = require('ws');

let tc = 0;

const ws_server = new Server({ server });

ws_server.on('connection', (ws) => { 
   console.log('New client connected!');
   ws.on('close', () => console.log('Client has disconnected!'));
   
   ws.on('message', function() { tc++;  console.log(tc); });
});

setInterval(() => {
  ws_server.clients.forEach((client) => {
    let position = {x: Math.floor(Math.random() * 200), y: Math.floor(Math.random() * 150), t: tc}
    const data = JSON.stringify({'position': position});
    client.send(data);
  });
}, 1000);


