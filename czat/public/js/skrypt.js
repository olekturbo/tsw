//jshint browser: true, esversion: 6, globalstrict: true, devel: true
/* globals io: false */
'use strict';

// Inicjalizacja UI
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let status = document.getElementById('status');
        let open = document.getElementById('open');
        let close = document.getElementById('close');
        let send = document.getElementById('send');
        let createRoom = document.getElementById('create-room');
        let text = document.getElementById('text');
        let room = document.getElementById('room');
        let message = document.getElementById('message');
        let roomList = document.getElementById('room-list');
        let name = document.getElementById('name');
        let sendName = document.getElementById('send-name');
        let nameForm = document.getElementById('name-form');
        let chatForm = document.getElementById('chat-form');
        let socket;
        let currentRoom = 'default';

        status.textContent = 'Brak połącznia';
        close.disabled = true;
        send.disabled = true;
        createRoom.disabled = true;

        if (localStorage.getItem('name')) {
            nameForm.className = "hidden";
            chatForm.className = "";
        } else {
            nameForm.className = "";
            chatForm.className = "hidden";
        }

        // Pobieramy imię
        sendName.addEventListener('click', () => {
            localStorage.setItem('name', name.value);
            nameForm.className = "hidden";
            chatForm.className = "";
        });

        // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
        open.addEventListener('click', () => {
            open.disabled = true;
            socket = io.connect(`http://${location.host}`);

            socket.on('connect', () => {
                close.disabled = false;
                send.disabled = false;
                createRoom.disabled = false;
                status.src = 'img/bullet_green.png';
                console.log('Nawiązano połączenie przez Socket.io');
                socket.on('db-messages', (data) => {
                    data.forEach(el => {
                        newMessage(el.date, el.author, el.text);
                    });
                    message.scrollTop = 0;
                });
                socket.on('db-rooms', (data) => {
                    data.forEach(el => {
                        newRoom(el.name);
                    });
                    roomList.scrollTop = 0;
                });
                let author = localStorage.getItem('name');
                socket.emit('new author', {
                    author: author
                });
                socket.on('check author', (data) => {
                    if (!data) {
                        localStorage.clear();
                        alert('Name is busy.');
                        close.disabled = true;
                        send.disabled = true;
                        createRoom.disabled = true;
                        nameForm.className = "";
                        chatForm.className = "hidden";
                        message.textContent = '';
                        roomList.textContent = '';
                        socket.disconnect();
                    }
                });
            });
            socket.on('disconnect', () => {
                open.disabled = false;
                status.src = 'img/bullet_red.png';
                console.log('Połączenie przez Socket.io zostało zakończone');
            });
            socket.on('error', (err) => {
                message.textContent = `Błąd połączenia z serwerem: "${JSON.stringify(err)}"`;
            });
            socket.on('echo', (data) => {
                newMessage(data.date, data.author, data.text);
            });
            socket.on('update rooms', (data) => {
                newRoom(data);
                if (data === 'default') {
                    document.querySelector('.single-room').setAttribute('active', true);
                }
            });
        });

        let newMessage = (date, author, text) => {
            let li = document.createElement('li');
            let dateSpan = document.createElement('span');
            let authorSpan = document.createElement('span');
            let textSpan = document.createElement('span');
            dateSpan.textContent = '(' + date + ')';
            authorSpan.textContent = author + ':';
            textSpan.textContent = text;
            dateSpan.classList = 'msg-date';
            authorSpan.classList = 'msg-author';
            textSpan.classList = 'msg-text';
            li.appendChild(dateSpan);
            li.appendChild(authorSpan);
            li.appendChild(textSpan);
            li.classList = 'list-unstyled';
            message.appendChild(li);
            message.scrollTop = 0;
        };

        let newRoom = (room) => {
            let li = document.createElement('li');
            let roomSpan = document.createElement('span');
            roomSpan.textContent = room;
            roomSpan.classList = 'single-room';
            li.appendChild(roomSpan);
            li.classList = 'list-unstyled';
            roomList.appendChild(li);
            roomList.scrollTop = 0;

            roomSpan.addEventListener('click', () => {
                let allRooms = document.querySelectorAll('.single-room');
                allRooms.forEach(element => {
                    element.removeAttribute('active');
                });
                roomSpan.setAttribute('active', true);
                let oldRoom = currentRoom;
                currentRoom = room;

                socket.emit('switch room', {
                    room: currentRoom,
                    oldRoom: oldRoom
                });
                socket.on('clear room', () => {
                    message.textContent = '';
                });
            });
        };

        // Zamknij połączenie po kliknięciu guzika „Rozłącz”
        close.addEventListener('click', () => {
            close.disabled = true;
            send.disabled = true;
            createRoom.disabled = true;
            message.textContent = '';
            roomList.textContent = '';
            socket.emit('remove author', {
                author: localStorage.getItem('name')
            });
            socket.disconnect();
        });

        // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
        send.addEventListener('click', () => {
            let author = localStorage.getItem('name');
            let today = new Date();
            socket.emit('send message', {
                text: text.value,
                author: author,
                date: today.toLocaleTimeString(),
                room: currentRoom
            });
            console.log(`Wysłałem wiadomość: „${text.value}” od "${author}"`);
            text.value = '';
        });

        // Nowy pokój
        createRoom.addEventListener('click', () => {
            socket.emit('new room', {
                room: room.value
            });
            room.value = '';
        });
    }
};