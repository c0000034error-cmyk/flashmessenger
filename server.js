const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static('.'));

let users = [];
let messages = [];

app.post('/register', (req, res) => {
  const { username } = req.body;
  const user = { id: Date.now(), username };
  users.push(user);
  res.json({ success: true, user });
});

app.get('/search/:username', (req, res) => {
  const foundUsers = users.filter(u => 
    u.username.includes(req.params.username)
  );
  res.json(foundUsers);
});

io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    messages.push(data);
    socket.broadcast.emit('receive_message', data);
  });
});

server.listen(3001, () => console.log('Server running on port 3001'));