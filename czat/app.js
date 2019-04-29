//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('../czat_db/db.json');
const db = low(adapter);

app.use(serveStatic('public'));

let onlineUsers = [];

io.sockets.on('connect', (socket) => {
    console.log('Socket.io: połączono.');
    socket.emit('update rooms', 'default');
    socket.join('default');
    socket.emit('db-messages', db.get('messages').filter({ room: 'default' }).takeRight(5));
    socket.emit('db-rooms', db.get('rooms'));

    socket.on('send message', (data) => {
        let currentRoom = 'default';
        if (data.room !== 'default') {
            currentRoom = data.room;
        }
        io.to(currentRoom).emit('echo', data);

        db.get('messages')
            .push({
                date: data.date,
                author: data.author,
                text: data.text,
                room: currentRoom
            })
            .write();
    });
    socket.on('disconnect', () => {
        console.log('Socket.io: rozłączono.');
    });
    socket.on('error', (err) => {
        console.dir(err);
    });
    socket.on('new author', (data) => {
        if (!onlineUsers.includes(data.author)) {
            onlineUsers.push(data.author);
        } else {
            socket.emit('check author', false);
        }
    });
    socket.on('remove author', (data) => {
        onlineUsers = onlineUsers.filter(user => user !== data.author);
    });
    socket.on('new room', (data) => {
        if (data.room !== "") {
            io.emit('update rooms', data.room);
            db.get('rooms')
                .push({
                    name: data.room
                })
                .write();
        }
    });
    socket.on('switch room', (data) => {
        socket.emit('clear room', {});
        socket.emit('echo', {
            date: new Date().toLocaleTimeString(),
            author: 'SERWER',
            text: 'Przełączono na pokój: ' + data.room
        });
        socket.emit('db-messages', db.get('messages').filter({ room: data.room }).takeRight(5));
        socket.leave(data.oldRoom);
        socket.join(data.room);
    });
});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
