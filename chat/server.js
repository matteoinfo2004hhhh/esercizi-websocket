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

ws_server.on('connection', (ws) => {
   if (quanti >= 10) {
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
   console.log("Nuovo utente - ID: " + ws.id + ", Nickname: " + ws.nickname);
   ws.on('close', () => {
      console.log("Utente disconnesso - ID: " + ws.id + ", Nickname: " + ws.nickname);
      nicknames.delete(ws.nickname);
   });
   ws.on('message', (message) => {
      const arriva = JSON.parse(message);
      quale = arriva.manda.quale;
      tutto = tutto + ws.nickname + " " + quale + "\n";
      console.log("Chi: " + ws.nickname + " Quale: " + quale);
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
   const adjectives = ['happy', 'sad', 'funny', 'serious', 'clever', 'clumsy', 'lucky', 'unlucky', 'fast', 'slow'];
   const nouns = ['cat', 'dog', 'elephant', 'lion', 'tiger', 'unicorn', 'monkey', 'robot', 'alien', 'wizard'];
   const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
   const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
   return randomAdjective + '_' + randomNoun;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});
