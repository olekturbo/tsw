/* jshint strict: global, esversion: 6, devel: true, node: true */
'use strict';

const logic = require('../logic');
const uuidv1 = require('uuid/v1');

let games = new Map();

exports.newGame = function newGame(req, res) {
    let newId = uuidv1();
    let game = logic.createGame(req.body.size, req.body.colors, req.body.steps);
    let result = {
        "game": newId,
        "size": req.body.size,
        "colors": req.body.colors,
        "steps": req.body.steps
    };

    games.set(newId, game);
    res.json(result);
};

exports.move = function move(req, res) {
    let solution = games.get(req.body.game).solution;
    let result = {
        "game": req.body.game,
        "result": logic.countSolution(solution, req.body.move),
        "steps": --games.get(req.body.game).steps
    };

    if (logic.countSolution(solution, req.body.move).black === games.get(req.body.game).size) {
        games.get(req.body.game).solved = true;
    }

    res.json(result);
};

exports.status = function status(req, res) {
    let isSolved = games.get(req.body.game).solved;
    let result = {
        "game": req.body.game,
        "solved": isSolved
    };

    res.json(result);
}