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
        let text = document.getElementById('text');
        let message = document.getElementById('message');
        let name = document.getElementById('name');
        let sendName = document.getElementById('send-name');
        let nameForm = document.getElementById('name-form');
        let chatForm = document.getElementById('chat-form');
        let socket;

        status.textContent = 'Brak połącznia';
        close.disabled = true;
        send.disabled = true;

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
                status.src = 'img/bullet_green.png';
                console.log('Nawiązano połączenie przez Socket.io');
                socket.on('db', (data) => {
                    data.forEach(el => {
                        newMessage(el.date, el.author, el.text);
                    });
                    message.scrollTop = 0;
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
                        nameForm.className = "";
                        chatForm.className = "hidden";
                        message.textContent = '';
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
        }

        // Zamknij połączenie po kliknięciu guzika „Rozłącz”
        close.addEventListener('click', () => {
            close.disabled = true;
            send.disabled = true;
            message.textContent = '';
            socket.disconnect();
        });

        // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
        send.addEventListener('click', () => {
            let author = localStorage.getItem('name');
            let today = new Date();
            socket.emit('send message', {
                text: text.value,
                author: author,
                date: today.toLocaleTimeString()
            });
            console.log(`Wysłałem wiadomość: „${text.value}” od "${author}"`);
            text.value = '';
        });
    }
};