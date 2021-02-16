// @ts-nocheck
const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  // ...
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`Disconnected: ${socket.id}`));
  socket.on('join', (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);
  });
  socket.on('chat', (data) => {
    const { message, room } = data;
    console.log(`msg: ${message}, room: ${room}`);
    io.to(room).emit('chat', message);
  });
});

httpServer.listen(4000);
