//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

app.use(serveStatic('public'));

io.sockets.on('connect', (socket) => {
    console.log('Socket.io: połączono.');
    
    socket.emit('db', db.get('messages').take(5));

    socket.on('send message', (data) => {
        socket.emit('echo', data);
        db.get('messages')
            .push({
                date: data.date,
                author: data.author,
                text: data.text
            })
            .write();
    });
    socket.on('disconnect', () => {
        console.log('Socket.io: rozłączono.');
    });
    socket.on('error', (err) => {
        console.dir(err);
    });
});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
