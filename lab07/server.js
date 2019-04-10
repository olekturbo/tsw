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


let countSolution = (solution, move) => {
    let whiteColors = 0;
    let blackColors = 0;
    let flags = new Array(solution.length);
    
    solution.forEach((s,i) => {
        if(s === move[i]) {
            flags[i] = true;
            blackColors++;
        }
    });

    solution.forEach((s, i) => {
        if(s !== move[i]) {
            move.forEach((m, j) => {
                if(!flags[j] && j !== i && m === s) {
                    flags[j] = true;
                    whiteColors++;
                    return;
                }
            });
        }
    });

    return {
        "black": blackColors,
        "white": whiteColors
    };
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
        "result": countSolution(solution, move),
        "steps": --games.get(req.body.game).steps,    
        "solution": solution
    };

    if(countSolution(solution, move).black === games.get(req.body.game).size) {
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
