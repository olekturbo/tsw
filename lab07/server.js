/* jshint strict: global, esversion: 6, devel: true, node: true */
'use strict';

const app = require('express')();
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

let games = new Map();

let createGame = (size, colorCount, steps) => {
    return {
        solution: [...Array(size).keys()].map(x => Math.floor(Math.random() * colorCount) + 1),
        solved: false,
        steps: steps,
        size: size
    };
};

let countBlack = (game, move) => {
    let count = 0;
    for(let i = game.length; i--;) {
        if(game[i] === move[i])
            count++;
    }

    return count;
};

let countWhite = (game, move) => {
    let count = 0;
    move.forEach((element, i) => {
        if(game.includes(element) && element !== game[i]) {
            count++;
        }
    });
    return count;
};

app.post('/game/new', (req, res) => {
    let newId = uuidv1();
    let game = createGame(req.body.size, req.body.colors, req.body.steps);
    let result = {
        "game": newId,
        "size": req.body.size,
        "colors": req.body.colors,
        "steps": req.body.steps
    };
    games.set(newId, game);
    res.json(result);
});

app.post('/game/move', (req, res) => {
    let solution = games.get(req.body.game).solution;
    let move = req.body.move;
    let result = {
        "game": req.body.game,
        "result": {
            "black": countBlack(solution, move),
            "white": countWhite(solution, move)
        },
        "steps": --games.get(req.body.game).steps,    
    };

    if(countBlack(solution, move) === games.get(req.body.game).size) {
        games.get(req.body.game).solved = true;
    }

    res.json(result);
});

app.post('/game/status', (req, res) => {
    let isSolved = games.get(req.body.game).solved;
    let result = {
        "game": req.body.game,
        "solved": isSolved
    };

    res.json(result);
});

app.listen(port, () => {
    console.log('Serwer działa na porcie 3001.');
});
