/* jshint strict: global, esversion: 6, devel: true, node: true */
'use strict';

const app = require('express')();
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

let ids = new Map();
const colors = ['red', 'yellow', 'purple', 'cyan',
                'orange', 'green', 'gray', 'blue',
                'brown', 'orchid', 'salmon', 'violet',
                'deepskyblue', 'dodgerblue', 'firebrick'];

let createGame = (size, colorCount) => {
    let gameBoard = [];
    colors.forEach(element => {
        colors[Math.floor(Math.random()*colors.length)];
    });
};

app.post('/game/new', (req, res) => {
    let newId = uuidv1();
    let game = createGame(req.body.size, req.body.colors);
    let result = {
        "game": newId,
        "size": req.body.size,
        "colors": req.body.colors,
        "steps": req.body.steps
    };
    ids.set(newId, game);
    res.json(result);
});

app.post('/game/move', (req, res) => {
    let result = {
        "game": req.body.game,
        "result": {
            "black": 1,
            "white": 0
        }
    };
    res.json(result);
});

app.listen(port, () => {
    console.log('Serwer działa na porcie 3001.');
});
