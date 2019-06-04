//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);
const request = require('request');

const _ = require('lodash');

app.use(serveStatic('public'));

io.sockets.on('connect', (socket) => { 
    socket.on('woj', (data) => {
    
        request('http://10.10.44.6:3000/wojewodztwa', { json: true }, (err, res, body) => {
            let wojewodztwa = res.body;
            wojewodztwa.forEach(element => {
                if(element.województwo == data.woj) {
                    request('http://10.10.44.6:3000/wyniki?id_gte=' + element.id + "&id_lte=" + (parseInt(element.id) + 19999), { json: true }, (err, res, body) => { 
                            
                            const posortowaneGminy = _.orderBy(res.body, [gmina => gmina.gmina.toLowerCase()], ['asc']);
                            socket.emit('gminy', {
                                gminy: posortowaneGminy
                            });

                    }); 
                }
            });
        if (err) { return console.log(err); }
        });
    }); 
});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
