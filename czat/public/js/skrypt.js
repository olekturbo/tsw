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
        let messagesHistory;
        let socket;

        status.textContent = 'Brak połącznia';
        close.disabled = true;
        send.disabled = true;

        if(localStorage.getItem('name')) {
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
                let li = document.createElement('li');
                li.textContent = `(${data.date}) ${data.author}: ${data.text}`;
                li.classList = 'list-unstyled';
                message.append(li);
            });
            socket.on('db', (data) => {
                data.forEach(el => {
                    let li = document.createElement('li');
                    li.textContent = `(${el.date}) ${el.author}: ${el.text}`;
                    li.classList = 'list-unstyled';
                    message.append(li);
                });
            });
        });

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
                date: today.getHours() + ':' + today.getMinutes()
            });
            console.log(`Wysłałem wiadomość: „${text.value}” od "${author}"`);
            text.value = '';
        });
    }
};