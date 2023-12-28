const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require('ws');
const ws_server = new Server({ server });

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

let quanti = 0;
let tutto = "";
let nicknames = new Set();

ws_server.on('connection', (ws, req) => {
   const ip = "192.169.1." + (Math.floor(Math.random() * 256));
   ws.send(JSON.stringify({ ip: ip }));

   if (quanti >= 100) {
      ws.close();
      return;
   }

   quanti++;
   ws.id = quanti;
   let nickname;
   do {
      nickname = generateRandomNickname();
   } while (nicknames.has(nickname));

   nicknames.add(nickname);
   ws.nickname = nickname;

   console.log("Nuovo utente - ID: " + ws.id + ", Nickname: " + ws.nickname + ", IP: " + ip);

   ws.on('close', () => {
      console.log("Utente disconnesso - ID: " + ws.id + ", Nickname: " + ws.nickname + ", IP: " + ip);
      nicknames.delete(ws.nickname);
   });

   ws.on('message', (message) => {
      const arriva = JSON.parse(message);
      quale = arriva.manda.quale;
      tutto = tutto + ws.nickname + " " + quale + "\n";
      console.log("Chi: " + ws.nickname + " Quale: " + quale + ", IP: " + ip);

      let position = {
         testo: tutto
      }
      
      const data = JSON.stringify({'position': position});
      ws_server.clients.forEach((client) => {
         client.send(data);
      });
   });
});

function generateRandomNickname() {
   const adjectives = ['giocatore1:', 'giocatore2:', 'giocatore3:','giocatore4:','giocatore5:','giocatore6:','giocatore7:','giocatore8:','giocatore9:','giocatore10:','giocatore11:'];
   const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
   return randomAdjective;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});