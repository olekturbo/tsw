/* jshint strict: global, esversion: 6, devel: true, node: true */
'use strict';

const controller = require('../controller');

module.exports = function (app) {
    app.post('/game/new', (req, res) => {
        controller.newGame(req, res);
    });

    app.post('/game/move', (req, res) => {
        controller.move(req, res);
    });

    app.post('/game/status', (req, res) => {
        controller.status(req, res);
    });
};