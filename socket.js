io.on('connection', function (socket) {
   socket.on('message', function (data) {
        io.emit('send', data);
   });
});